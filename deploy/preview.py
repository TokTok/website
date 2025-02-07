#!/usr/bin/env python3
import re
import subprocess  # nosec
from functools import cache
from typing import Any

import requests


@cache
def git_branch() -> str:
    """Get the current git branch."""
    return (subprocess.check_output(
        ["git", "rev-parse", "--abbrev-ref", "HEAD"]).decode().strip())


@cache
def git_origin() -> str:
    """Get the URL of the origin remote.

    E.g. "git@github.com:iphydf/website".
    """
    return (subprocess.check_output(["git", "remote", "get-url",
                                     "origin"]).decode().strip())


@cache
def git_upstream() -> str:
    """Get the URL of the upstream remote.

    E.g. "git@github.com:toktok/website".
    """
    return (subprocess.check_output(["git", "remote", "get-url",
                                     "upstream"]).decode().strip())


@cache
def github_slug() -> str:
    """Extract the GitHub slug from the upstream remote."""
    match = re.match(r".*github\.com[:/](.*?)(\.git)?$", git_upstream())
    if not match or not match.group(1):
        raise ValueError("Could not extract GitHub slug.")
    return match.group(1)


@cache
def github_prs() -> Any:
    """Check GitHub API for PRs on the upstream slug."""
    response = requests.get(
        f"https://api.github.com/repos/{github_slug()}/pulls?state=open",
        timeout=5,
    )
    response.raise_for_status()
    return response.json()


def github_pr_for_branch(branch: str) -> int:
    """Find the PR for a branch."""
    for pr in github_prs():
        if pr["head"]["ref"] == branch:
            return int(pr["number"])
    raise ValueError(f"No PR found for branch {branch}.")


def main():
    """ """
    print(f"Branch: {git_branch()}")
    print(f"Origin: {git_origin()}")
    print(f"Upstream: {git_upstream()}")
    print(f"Slug: {github_slug()}")
    print(f"PRs: {len(github_prs())}")
    print(f"PR: {github_pr_for_branch(git_branch())}")

    print("Building preview...")
    subprocess.check_call(
        ["docker", "build", "-t", "toxchat/toktok.github.io:latest", "."])

    print("Extracting site from docker image...")
    subprocess.check_call(["rm", "-rf", "toktok-site"])
    tar = subprocess.Popen(["tar", "-x"], stdin=subprocess.PIPE)
    if tar.stdin is None:
        raise ValueError("Could not open tar stdin.")
    subprocess.check_call(
        [
            "docker",
            "run",
            "--rm",
            "--entrypoint",
            "tar",
            "toxchat/toktok.github.io:latest",
            "-C",
            "/home/builder/build",
            "-c",
            "toktok-site",
        ],
        stdout=tar.stdin,
    )
    tar.stdin.close()
    print("Waiting for tar to finish...")
    tar.wait()

    print("Deploying preview...")
    subprocess.check_call([
        "netlify",
        "deploy",
        "--alias",
        f"deploy-preview-{github_pr_for_branch(git_branch())}",
    ])


if __name__ == "__main__":
    main()
