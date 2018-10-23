---
title: FAQ
permalink: faq.html
menu_index: 7
navicon: fas fa-info-circle
---

# FAQ

The most common questions we get are answered here. If you have a
question for us that you think should appear in this list that doesn't,
send an email to the support mailing list with your
suggestion: [support@lists.tox.chat](mailto:support@lists.tox.chat)

# User FAQ
[Skip to technical FAQ (advanced)](#technical-faq-advanced)

-   [How does Tox protect my privacy?](#how-does-tox-protect-my-privacy)
-   [How do I add someone to my contacts list?](#how-do-i-add-someone-to-my-contacts-list)
-   [What happens when I remove someone from my contacts list?](#what-happens-when-i-remove-someone-from-my-contacts-list)
-   [Does Tox leak my IP address?](#does-tox-leak-my-ip-address)

## How does Tox protect my privacy?

### Tox protects your privacy by:
-   Removing the need to rely on central authorities to provide messenger services
-   Enforcing end-to-end encryption
with [perfect forward secrecy](https://en.wikipedia.org/wiki/Forward_secrecy)
as the default and only mode of operation for all messages
-   Making your identity impossible to forge without the possesion of your
personal private key, which never leaves your computer

## How do I add someone to my contacts list?

Look in the profile or settings panel of your client to get your Tox ID
which should look something like:

    56A1ADE4B65B86BCD51CC73E2CD4E542179F47959FE3E0E21B4B0ACDADE51855D34D34D37CB5

Give yours to your friend and get your friend to add it. That's it.

If you want a shorter and more memorable ID, you can use a service
like [ToxMe](https://toxme.io/), that maps an 
email-address-style username to a Tox ID. However, an individual
concerned about their security should avoid using these services
where possible. Unfortunately, the cost of this convenient name-to-Tox ID
mapping is a loss of decentralization. You must trust that the entity
running the service is serving you (and others looking for you) accurate
information. If you're not careful, you may be subject
to [MITM attacks](https://en.wikipedia.org/wiki/Man-in-the-middle_attack).

## What happens when I remove someone from my contacts list?

If you remove someone from your contacts list, they will see you go
offline, as if you closed your client normally. They can't communicate
with you any longer until you add them to your contacts list again.

## Does Tox leak my IP address?

Tox makes no attempt to cloak your IP address when communicating with
friends, as the whole point of a peer-to-peer network is to connect you
directly to your friends. A workaround does exist in the form of tunneling
your Tox connections through Tor. However, a non-friend user cannot easily
discover your IP address using only a Tox ID; you reveal your IP address
to someone only when you add them to your contacts list.

See Also: [What is stopping people from tracking me through the public DHT (advanced)](#tox-tracking-dht).

# Technical FAQ (advanced)
[Back to user FAQ](#user-faq)

