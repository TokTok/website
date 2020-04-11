---
title: How the crypto Tox uses works
id: 251
categories:
  - Tox Core
date: 2014-04-27 16:06:36
tags:
---

Yesterday, I made this: https://gist.github.com/irungentoo/58a8b5da5b2becd09e0f

If this is the first time you see this puzzle and want to try solving it then stop reading this now.

I was very disappointed that only one anonymous person seemed to know how to solve it so I'm writing this to educate you on how the crypto Tox uses to encrypt messages works.

First of all, the flaw in the secure_chat.py program in the puzzle is that nonces are reused for every message. If every message had a different nonce this puzzle would be unsolvable.

I'll start by explaining how crypto_box in NaCl works before telling you the solution.

crypto_box_keypair(pk,sk) generates a Curve25519 public/private keypair for us. crypto_box_beforenm(k,pk,sk) then uses our secret key and the other guys public key to generate a key using ECDH (Elliptic curve Diffie-Hellman)

The other guy also uses it on his side and gets the same key as us.

So both now have the same 256bit key that only they know.

what do they do with that key? they use it to encrypt/decrypt data using xsalsa20: a stream cipher.

How does a stream cipher work?

You have a function to generate a stream of pseudorandom bytes based on a nonce and a key: crypto_stream(c,clen,n,k)

To encrypt a message, just generate a stream as long as the message then XOR the message with the stream.

Since the stream looks random, the stream xored with the message will also appear to be random.

To decrypt the message, just use the same nonce and key to generate a stream then xor the stream with the encrypted message to get the message.

Now, this is nice and all but how do we protect ourselves against someone modifying the message? Or someone trying to send us fake messages?

That's where the MAC (message authentication code) Poly1305 comes in.

MACs are used to authenticate messages, by verifying them, the receiver

crypto_onetimeauth(a,m,mlen,k) Is used to generate a 16 byte authenticator that is appended to the beginning of each plaintext message encrypted with crypto_box right before being actually encrypted.

Poly1305 requires that the key given to it is always different so it takes the first 32bytes that comes out of crypto_stream(c,clen,n,k) (clen is always 32 + 16 (the length of the MAC) + msglen) for that key.

So, it generates an xsalsa20 stream 48 bytes longer than the message, takes the first 32 to generate the 16 byte MAC, appends it to the beginning of the message and encrypts the MAC+Message with the rest of the generated stream bytes.

So how do we solve the puzzle?

nonces are reused which means the stream generated by crypto_stream(c,clen,n,k) is the same for all messages.

The first two packets are obviously the handshake (size checks out).

This particular python wrapper puts the 24 byte nonce at the beginning of each encrypted message and we know the handshake.

So we just xor the plaintext handshake with where the message is in the encrypted message to get the stream.

With the stream we can then decrypt all the packets that use that same nonce by xoring the stream with the encrypted message.

Repeat that for the packets with the other nonce and we can decrypt everything.

Easy right?

This is why every single message must be encrypted with a different nonce, so that a different stream is used for each message.

Further reading:
http://nacl.cr.yp.to/box.html
http://nacl.cr.yp.to/stream.html
http://nacl.cr.yp.to/onetimeauth.html
https://en.wikipedia.org/wiki/Curve25519
https://en.wikipedia.org/wiki/Elliptic_curve_Diffie%E2%80%93Hellman
https://en.wikipedia.org/wiki/Poly1305-AES

https://en.wikipedia.org/wiki/Cryptographic_nonce