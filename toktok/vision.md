---
layout: default
title: Long term vision
permalink: vision.html
menu_index: 7
---

The TokTok Project goal is to **reinvent the internet**. Big words. What does
reinventing the internet mean? Let's first look at where we are now.

# Our digital life

Imagine this: you activate your smartphone in the morning, and you receive a
bunch of messages from friends and play a game of chess with a stranger on the
internet.  You then turn on your laptop and open a document you were working on
from your desktop computer earlier today.  Sounds pretty normal, right? These
are things our internet supports.

How does all of this work?

- Your friend wrote a message to you. When they press "send", the phone
  application sends the message to a server (a publicly accessible computer) on
  the internet. When you wake up your phone, it connects to that server and
  collects the message. The server may then tell your friend's phone that the
  message was collected and mark it as delivered.
- To play a game of chess, you connect to a chess server, which mediates
  between you and your chess partner. It verifies that the moves you make are
  valid, and decides when the game is over (someone won or gave up).
- To access a document on two computers, you store it on a server and retrieve
  it. Anytime you change it, a new copy is uploaded to the server, and your
  other computers will download it.

Sounds good. Seems fine. Except there is one problem with all of this: those
servers storing information and computing things for you are most likely *not
yours*.

# A new way of computing

Let's reimagine this.

Let's imagine, instead of storing messages on a server, we store it on and
retrieve it from the internet. Instead of having a server calculate your
company's annual revenue, the internet does that. Your documents are stored on
the internet. You want your videos stabilised? Send them off to the internet
along with a stabilisation program and get it done.. by the internet.

## What is the internet?

The internet is made up of every computer that is connected to it. It's a
network of computers that all do exactly two things: store data, and calculate
stuff. This is already the case, but the difference between the current
internet and the new internet is this: In the new internet, **none of the
computers know what they are doing**. Compute power is simply a resource that
you use and provide, buy and sell.

In this internet, there is **no surveillance**, because there is nothing to
see.  Pieces of data are flying around the internet, partial computations are
performed in various places, but there is no way to reconstruct the intent of
the originator.

In this internet, there is **no censorship**. There is nothing to block. There
are no patterns to match internet packets against, as they all look similar to
observers: like random noise.

# How?

There are various advances in distributed routing made by projects such as
[Freenet](https://freenetproject.org). Other projects, such as Tox, have
created means for private communication. The TokTok project is about spreading
these means, making them *easy* for people to use, and furthering research in
these areas. We will create a transition path for traditional services to
operate within the new internet and gradually migrate.

# No really, how?

You're interested in the technical details? Well, we haven't worked out all the
exact details, yet, but the current plan is:

- *Use the Tox protocol to establish a mesh network*. This builds on top of the
  traditional internet and creates a network where devices are not addressed by
  Internet Protocol Address, but by public key.  This lowest level allows
  devices to find each other on the internet and establishes computationally
  secure communication channels between them.
- *Build a dynamic distributed storage system on top of the mesh*. The TokTok
  Distributed File System (TDFS) provides a means for ephemeral data storage.
  It builds on ideas in Freenet to create a way to reliably and securely store
  information. If information is used, it is stored. If it is forgotten, the
  internet will forget about it as well.
- *Build a distributed computation platform*. To perform secure and anonymous
  computations, the computation itself needs to be split into pieces. Each
  participant in the computation receives a part of the problem and
  instructions to execute on that problem. The TokTok Distributed Computer
  (TDC) builds on ideas in [Folding@home](https://folding.stanford.edu/) to
  provide a virtual computer that can securely execute any program on any data
  using CPU cycles from a distributed set of physical computers.

# In the meantime..

..we're [building privacy enhancing software for everyone](mission.html).

This document presents the long term vision, but like we said, we are a
focussed group of software and systems engineers, cryptographers, and
distributed systems researchers. We want to bring value to the world by helping
every person protect their privacy using the software we create or collaborate
on.
