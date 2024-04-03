# 密码学

## 加密算法

### 非对称加密

非对称加密（Asymmetric Encryption）指使用不同的密钥进行数据加密和解密的加密机制。其主要特点包括:

1. 使用公钥和私钥。公钥用于加密，私钥用于解密，两者不同且一一对应。
2. 计算困难。从数学上证明，从公钥推导私钥在计算上是不可行的。
3. 加解密算法不同。加密和解密使用的是不同的数学算法。
4. 保密性和认证性。使用私钥签名可以实现认证，公钥加密保证保密性。
5. 算法例如 RSA、ECC 等。

非对称加密应用场景：数字签名，身份认证；密钥分发和交换；小数据量加密；TLS/SSL 安全通信。

与对称加密相比，非对称加密可以简化密钥管理，但运算复杂，速度较慢。常用于网络安全传输和身份认证中。

#### RSASSA-PKCS1-v1_5

RSASSA-PKCS1-v1_5 是一种 RSA 数字签名算法，广泛用于公钥加密系统中。它的主要特点是:

1. 基于 RSA 公钥加密算法。使用私钥签名，公钥验证签名。
2. 定义了对签名数据的填充和编码格式。按照 PKCS#1 v1.5 标准进行处理。
3. 签名过程：对数据进行 Hash，填充到符合格式，然后用私钥加密。
4. 验证过程：用公钥解密签名，检查格式，提取 Hash 值，与原数据 Hash 比对。
5. 可以对任意长度的数据进行签名，通用性强。
6. 在 TLS、SSL、SSH 等协议中都得到应用。
7. 在低能耗和硬件加密场景下表现良好。

总之，RSASSA-PKCS1-v1_5 利用 RSA 算法提供了一个安全的签名方案，可用于数据完整性保护、身份认证等场景，是公钥基础设施的标准组成部分之一。但也存在安全问题，需要注意防范相关攻击。

#### RSA-PSS

RSA-PSS（Probabilistic Signature Scheme）是 RSA 数字签名的一种更安全的改进方案，主要特点是：

1. 引入随机化，通过随机数防止签名伪造。
2. 定义了 Mask Generation Function（MGF）和 salt 参数，增强安全强度。
3. 结合随机数和 Hash 运算，提高签名不可伪造性。
4. 在签名原文后添加填充数据，防止遭受关键信息泄露。
5. 验证时通过恢复 Hash 和 salt 检查签名有效性。
6. 可以防止 RSA 签名中多种攻击，更安全可靠。
7. 与 RSA 配合使用，也可应用其他公钥算法。
8. 已经成为数字签名标准的推荐算法之一。

总之，RSA-PSS 通过引入随机化和强化构造，增强了 RSA 签名的安全性，可以防止中间人攻击等威胁，是 RSA 签名的优选方案。但实现也更为复杂。

#### RSA-OAEP

RSA-OAEP（Optimal Asymmetric Encryption Padding）是一种更安全的 RSA 加密填充方案，主要特点是：

1. 引入随机数，提高加密强度和不可确定性。
2. 使用 Mask Generation Function（MGF）生成密文掩码。
3. 在明文后添加填充数据，提高保密性。
4. 可以防止选择明文攻击（CPA）。
5. 解密时验证填充数据，检查密文完整性。
6. 安全性建立在随机预言机模型之上。
7. 与基础 RSA 加密配合使用，提高安全等级。
8. 已经成为公钥加密标准的推荐算法。

总之，RSA-OAEP 通过改进填充方案，增强了 RSA 加密的安全强度，可以防止统计分析攻击和中间人攻击，是 RSA 加密的优选填充方案。但实现也更为复杂。

#### ECSDSA

ECDSA（Elliptic Curve Digital Signature Algorithm）是一种基于椭圆曲线的数字签名算法，主要具有以下特点:

1. 基于椭圆曲线加密（ECC），可以使用更短的密钥。
2. 安全性依赖于椭圆曲线离散对数问题（ECDLP）。
3. 通过公私钥对实现签名和验证。私钥签名，公钥验证。
4. 签名过程需要某种散列函数和随机数产生。
5. 椭圆曲线参数需要精心选择，以防范攻击。
6. 算法流程类似于 DSA，但使用椭圆曲线运算。
7. 可以生成较小的签名，减少计算和通信开销。
8. 被广泛应用于比特币、TLS、PGP 等技术中。

9. 在性能和效率上优于 RSA 签名。

总之，ECDSA 使得基于椭圆曲线的安全签名成为可能，密钥大小更小，算法更高效，已经成为主流的数字签名算法之一。

#### ECDH

ECDH（Elliptic Curve Diffie-Hellman）是一种基于椭圆曲线的密钥交换协议，主要特点是:

1. 基于椭圆曲线加密算法（ECC），可以使用更短的密钥。
2. 通过椭圆曲线点乘法实现密钥协商。
3. 安全性依赖困难的椭圆曲线离散对数问题（ECDLP）。
4. 每方选定一个私钥，计算公钥交换。不会泄露私钥。
5. 协商产生的共享密钥可用于对称加密和认证。
6. 算法流程类似普通 DH，但使用椭圆曲线运算。
7. 可以生成较小的公钥，降低存储和传输成本。
8. 应用在许多密码协议中，如 TLS/SSL。
9. 计算效率高，具有良好的前向安全性。

总之，ECDH 利用椭圆曲线提供了一个高效安全的密钥交换协议，使双方在不泄漏私钥的情况下协商出共享密钥，已经广泛用于各种网络安全应用当中。

### 对称加密

对称加密（Symmetric Encryption）是一种使用相同的密钥进行加密和解密的加密机制。其主要特点包括:

1. 使用单一密钥（Secret Key）。对称密钥用于数据的加密和解密，这个密钥必须由通信双方预先共享。
2. 加解密使用反向算法。加密算法和解密算法通常都是反向互逆的。
3. 加解密速度快。相比非对称加密，运算效率高，加解密速度快。
4. 保密性好但扩展性差。密钥分发和管理困难，不适合大规模系统。
5. 算法例如 AES(Advanced Encryption Standard)、DES(Data Encryption Standard)、RC4 等。

> [!NOTE]
> AES 现在已经是实际的标准，而 DES 已经过时（能够暴力破解），我们应该避免使用 DES。

对称加密应用场景：保护数据机密性，如文件加密；对速度敏感的大数据加密；在对等连接的安全通信；模式如：电子密码本、块密码等。

相比非对称加密，对称加密速度快、效率高，但密钥管理和分发复杂。需要同时具备保密性和认证性。通常用于加密会话和大数据量的场景。

* 密码算法分为分组密码和流密码两种
  * 分组密码是一种只能处理特定长度的一块数据的加密算法，它将明文划分为固定大小的块（或分组），然后对每个块进行加密。
  * 流密码是对数据进行连续处理的一类密码算法。流密码一般以 2bit、8bit、32bit 等单位进行加密和解密。

#### 分组密码操作模式

* ECB（Electronic Codebook）：每个块独立加密。这是最简单的模式，但也是最不安全的，因为相同的明文块会被加密为相同的密文块。
* CBC（Cipher Block Chaining）：每个明文块与前一个密文块进行异或操作后再加密。第一个块与一个随机初始化向量（IV）异或。
* CTR（Counter Mode）：将分组密码转变为流密码。使用一个计数器，与每个明文块异或，然后加密计数器。
* GCM（Galois/Counter Mode）：结合了 CTR 模式的流密码特性和额外的认证功能。
* OFB（Output Feedback）：与 CTR 类似，但是异或的是连续加密的 IV。
* CFB（Cipher Feedback）：与 OFB 类似，但是密文被馈送回输入。

例如：AES-CBC 是指使用 AES 算法和 CBC 操作模式的加密方法。这种组合为数据提供了机密性，并且由于 CBC 模式的引入，相同的数据块不会被加密成相同的密文块，从而增加了安全性。

#### HMAC

> HMAC（Hash-based Message Authentication Code）是一种基于哈希函数和密钥的消息认证码算法。它可以用于验证消息的完整性和身份验证消息的发送方。

HMAC 的工作原理是:

1. 将密钥与初始化向量用哈希函数混合，生成一个子密钥。
2. 使用子密钥与消息一起再次哈希，生成消息摘要。
3. 消息摘要就是 HMAC 的值。

验证HMAC:

1. 接收方用同样的密钥生成HMAC。
2. 将计算出的HMAC与消息一起传输的HMAC比较。
3. 如果相同，说明消息完整且来自合法发送方。

HMAC 的特点:

* 基于哈希函数，计算效率高。
* 引入密钥，保证不可伪造性。
* 可用于身份验证和消息完整性验证。
* 更安全防止哈希冲突攻击。
* 常用 HMAC-SHA256 算法。

总之，HMAC 利用对称密钥的哈希可以有效地验证和确认消息的完整性。它是一种重要的消息认证技术。

#### AES-CTR

> AES-CTR（Counter Mode）是另一种 AES 操作模式。

* 不对明文进行分块，可以对任意长度数据加密。
* 使用一个计数器（Counter）作为密钥流，与明文进行异或来生成密文。
* 计数器是一个递增的整数值，和一个固定的初始化向量组合，然后经过 AES 加密产生密钥流。
* 解密只需要用相同的计数器生成相同的密钥流，与密文异或即可还原明文。

AES-CTR 模式的加解密流程:

1. 初始化一个计数器 Counter = IV || 0
2. 对 Counter 进行AES加密，产生一段密钥流 Keystream
3. 密文 = 明文 XOR Keystream
4. Counter++，重复步骤 2-3 直到全部明文加密
5. 解密时重复相同的 Counter 生成相同的 Keystream，与密文异或得到明文

AES-CTR 的优点是可以并行计算和随机存取，不需要分块和填充，实现更简单，但需要保证 Counter 不重复使用。总体来说，AES-CTR 也是一种高效安全的对称加密模式。

#### AES-CBC

> AES-CBC（Cipher Block Chaining）是一种操作模式，用于在AES加密算法中对数据进行分组加密。其主要特点是:

* 将明文划分成固定长度的块（如 128 位），每块独立加密。
* 每块的加密都依赖于其前一块的密文。第一个块使用一个初始化向量（IV）进行异或运算作为初始链值。
* 每当一块被加密后，它的密文会与下一块进行异或，然后再进行加密，形成一种链式反馈模式。
* 解密时也需要采用相同的模式进行逆操作，每块使用前一块的密文进行异或还原。

AES-CBC 的加解密流程如下：

1. 将明文划分成若干块 M1， M2 ... 每个块 128 位
2. 对第一个块M1，先与初始化向量IV进行异或，再使用AES加密，得到密文C1
3. 对第二块M2，先与C1进行异或，再加密，得到C2
4. 依此类推，Ci = AES-Encrypt(Mi ^ Ci-1)
5. 解密时，Mi = AES-Decrypt(Ci) ^ Ci-1

AES-CBC 的优点是可以隐藏明文的重复模式，每个密文块都依赖前一块。但需要选择一个随机的IV以增强安全性。CBC 模式在 AES 加密中很常用。

#### AES-GCM

> AES-GCM（Galois/Counter Mode）是一种身份验证加密算法，即提供了数据加密和认证功能。它的主要特点是:

* 同样使用一个计数器进行加密，可以对任意长度数据进行操作。
* 加入了一个认证标签（tag），用于验证数据完整性。
* 基于高斯断线器（Galois field）来产生认证标签。
* 不需要填充，实现简单高效。

AES-GCM 的加解密流程:

1. 初始化计数器 IV，认证密钥H
2. 使用H生成认证标签 tag
3. 使用计数器 IV 产生密钥流，与明文异或得到密文
4. 将 tag 与密文一起发送
5. 解密端使用相同的 IV、H 重新生成 tag
6. 比较传入的 tag 和计算出的 tag，验证数据完整性
7. 使用 IV 生成密钥流，与密文异或恢复明文

所以AES-GCM通过加入认证标签，可以在保证高速加密的同时，提供认证和防篡改的功能。这使它很适合无线网络和资源受限的环境。总体来说，AES-GCM 是一种高效安全的身份验证加密算法。

#### AES-KW

> AES-KW（Key Wrapping）是一种使用 AES 算法进行密钥加密的模式。它的主要目的是为了安全传输对称加密的密钥。

AES-KW的工作流程是:

1. 需要传输的密钥经过填充处理，格式化为一个块。
2. 使用 AES 加密算法和一个密钥加密密钥（Key Encryption Key）对该块进行加密。
3. 将加密后的块作为密文传输。
4. 接收方使用密钥加密密钥进行 AES 解密，提取原始密钥。

AES-KW 的特点是:

* 可以安全包装和传输 AES 等对称加密的密钥。
* 强化了密钥的保密性和完整性。
* 自身也是一个对称加密过程，需要预共享密钥加密密钥。
* 算法简单高效，输出的密文可以还原为密钥。
* NIST 标准里指定的密钥传输算法。

总体来说，AES-KW 利用 AES 对称加密来实现密钥的安全传输，是一种重要的密钥管理机制，可广泛用于加密系统和协议中。但仍需依赖对称密钥体制。

### 摘要

摘要（也称为单向散列函数）是由散列函数从完整消息生成的更小值。理想情况下，摘要是可快速计算、不可逆且不可预测的，因此可用于表明是否有人篡改了给定的消息。**但是无法辨别伪装**。例如 bob 伪装成 alan 向 marry 发送了消息和摘要。

常见的信息摘要算法和摘要函数包括：

* MD5（Message Digest Algorithm 5）：128 比特摘要，计算速度快，但不安全，已被弃用。
* SHA-1（Secure Hash Algorithm 1）：160 比特摘要，曾经广泛使用，但目前被认为不安全。
* SHA-2：比较安全的 SHA 系列算法，包括 SHA-224、SHA-256 等，输出 224-512 比特不等的摘要。
* SHA-3：下一代 SHA Hash 函数，抵抗量子计算机攻击。
* RIPEMD（RACE Integrity Primitives Evaluation Message Digest）：设计更保守的 MD4 后继者。
* Whirlpool：基于改进版 AES 设计的哈希函数。
* BLAKE2：支持并行计算，速度更快的哈希函数。
* SM3：中国商用密码算法，生成 256 比特摘要。
* BLAKE3：时效性极强的加密哈希算法。

当前使用较多的摘要函数是 SHA-2 系列，如 SHA-256。新兴的 SHA-3 和 BLAKE3 也较为推荐。选择安全可靠的摘要函数很重要。

#### 消息认证码

通过消息认证码（Message Authentication Code，简称 MAC）可以确认自己收到的是否就是发送者的本意，使用消息认证码可以判断消息是否篡改，以及是否有人伪装成发送者发送了该消息。

消息认证码由任意长度的消息和一个发送者和任意接受者共享的密钥计算出来。

例如：

1. a 和 b 之间要事先共享密钥。
2. a 发送消息，以及根据共享密钥计算出 MAC 值发送。
3. b 根据消息以及共享密钥计算 MAC 值，然后进行对比，相同则是同一个人。

例如 SSL/TLS 的内容的认证以及完整性校验就是使用消息认证码。

> [!WARNING]
> 无法解决**第三方证明**以及**防止否认**的问题。第三方证明：a 和 b 发送消息，a 想让 c 来证明发送消息的就是 b，即使 c 拿到了 MAC 值也不能确定发送消息的是 b，也有可能是 a 自己。防止否认：就像之前所说 a 确认这条消息来自 b，但是 a 可以向 c 否定这条消息来自自己。

#### 数字签名

使用数字签名来识别篡改和伪装以及防止否认。数字签名就是通过将**公钥**反过来用来实现的。在数字签名中，生成消息签名的行为和验证消息签名的行为是需要使用各自专用的密钥完成的。

使用非对称加密实现数字签名，使用私钥加密生成数字签名，公钥解密验证数字签名。

* 数字签名有直接对消息签名以及对消息的散列值签名的方式。
  * 直接对消息签名需要对整个消息加密，非常的耗时
  * 先对消息求摘要，再通过对摘要进行签名，然后发送给接受者，接受者通过对方的公钥进行认证。

>[!NOTE]
>数字签名并不保证消息的机密性。

#### 证书

证书是由认证机构颁发的，由 ITU 和 ISO 制定的 x.509_ 规范：证书序列号、证书颁发者、公钥所有者、SHA-1 指纹、证书 ID、有效期（起始以及结束时间）、散列算法、密钥类型、公钥、密钥用途。

认证者首先要生成公钥私钥（也可以由认证机构代为生成）。这时候认证者首先会将公钥给认证机构进行数字签名（即生成证书）再发送给接受者。

公钥基础设施（Public-Key Infrastructure，PKI）是为了更有效的运用公钥而制定的一套规范，RSA 制定的 PKCS 系列规范就是 PKI 的一种

## JavaScript API

> 整个 windows 暴露出 `crypto` 对象，它有两个实例方法，以及暴露了一个 subtle 实例属性。

### 实例方法

* getRandomValues(TypedArray)：填充 TypedArray 中的每个元素都是随机值。
* randomUUID()：返回一个 UUID v4 字符串。

```js
crypto.getRandomValues(new Uint8Array(10))
crypto.randomUUID()
```

### 实例属性

#### 生成密钥

> ![NOTE]
> keyusages 是一个数组，包含了密钥的用途，但是各个密钥算法指定的用途各不相同：

* RSASSA-PKCS1-v1_5/ECDSA/HMAC/RSA-PSS：["sign", "verify"]
* ECDH/HKDF/PBKDF2：["deriveKey", "deriveBits"]
* RSA-OAEP/AES-CTR/AES-CBC/AES-GCM：["encrypt", "decrypt"]
* AES-CTR/AES-CBC/AES-GCM/AES-KW：["wrapKey", "unwrapKey"]

可以参见 Cloudflare 的[图表](https://developers.cloudflare.com/workers/runtime-apis/web-crypto/#supported-algorithms)查看各个算法的功能

```js
const key = await window.crypto.subtle.generateKey(
  {
    name: "HMAC",
    hash: { name: "SHA-512" },
  },
  true,
  ["sign", "verify"],
)
```

#### CryptoKey 对象

```js
console.log(
  `
    key: ${key.type.secret}
    algorithm: ${key.algorithm.name}
    extractable: ${key.extractable}
    usages: ${key.usages}
  `
)
```

#### 签名

```js
const encode = new TextEncoder()
const data = encode.encode(
  "Hello World"
)

const sign = await crypto.subtle.sign(
  "HMAC",
  key,
  data
)
```

#### 验证

```js
const verify = await crypto.subtle.verify("HMAC", key, sign, data)
// true
```

#### 加密解密

```js
const { publicKey, privateKey } = await crypto.subtle.generateKey(
    {
        name: "RSA-OAEP",
        modulusLength: 4096,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
)

const secrets = await window.crypto.subtle.encrypt("RSA-OAEP", publicKey, new TextEncoder().encode("Hello, World!"))
const message = await window.crypto.subtle.decrypt("RSA-OAEP", privateKey, secrets)
console.log(new TextDecoder().decode(message))
```

* `modulusLength`：RSA 加密的长度
* [`publicExponent`](https://stackoverflow.com/questions/51168408/how-can-i-use-publicexponent-as-65537-in-rsa-oaep-algorithm-in-javascript)：RSA 加密的公开指数（通常是 (E, N) 中的 E，私钥加密对是 (D, N)），一般使用 65535、17、3 作为公开指数。

应用——关于前端密码为什么要加密的参考：<https://blog.huli.tw/2023/01/10/security-of-encrypt-or-hash-password-in-client-side/>

#### [导出](https://developer.mozilla.org/zh-CN/docs/Web/API/SubtleCrypto/exportKey)/[导入](https://developer.mozilla.org/zh-CN/docs/Web/API/SubtleCrypto/importKey)密钥

```js
// 导出
const exportKey = await crypto.subtle.exportKey("raw", key)
```

* format 格式有以下几种
  * `raw`：原始格式
  * `pkcs8`：PKCS #8 格式
  * `spki`：SubjectPublicKeyInfo 格式
  * `jwk`：JSON Web Key 格式

```js
// 导入
// 返回值：CryptoKey
importKey(format, keyData, algorithm, extractable, keyUsages)
```

这里的 keyData 必须是：以给定格式包含密钥的 ArrayBuffer、TypedArray、DataView 或者 JSONWebKey 对象。

## 参考

* [密码学（Cryptography）](https://developer.mozilla.org/zh-CN/docs/Glossary/Cryptography)
* [摘要（Digest)](https://developer.mozilla.org/zh-CN/docs/Glossary/Digest)
* [密码散列散列函数（Cryptographic hash function）](https://developer.mozilla.org/zh-CN/docs/Glossary/Cryptographic_hash_function)
* [明文（Plaintext）](https://developer.mozilla.org/zh-CN/docs/Glossary/Plaintext)
* [密码套件（Cipher suit）](https://developer.mozilla.org/zh-CN/docs/Glossary/Cipher_suite)
* [密码（Cipher）](https://developer.mozilla.org/zh-CN/docs/Glossary/Cipher)
* [加密（Encryption）](https://developer.mozilla.org/zh-CN/docs/Glossary/Encryption)
* [密文（Ciphertext）](https://developer.mozilla.org/zh-CN/docs/Glossary/Ciphertext)
* [密钥（Key）](https://developer.mozilla.org/zh-CN/docs/Glossary/Key)
* [解密（Decryption）](https://developer.mozilla.org/zh-CN/docs/Glossary/Decryption)
* [密码分析（Cryptanalysis）](https://developer.mozilla.org/zh-CN/docs/Glossary/Cryptanalysis)
* [块密码操作模式（Block cipher mode of operation）](https://developer.mozilla.org/zh-CN/docs/Glossary/Block_cipher_mode_of_operation)
* [签名](https://developer.mozilla.org/en-US/docs/Glossary/Signature/Security)
* [对称加密（Symmetric-key cryptography）](https://developer.mozilla.org/en-US/docs/Glossary/Symmetric-key_cryptography)
* [非对称加密（public-key/asymmttric cryptography）](https://developer.mozilla.org/en-US/docs/Glossary/Public-key_cryptography)
* [数字证书（Digital certificate）](https://developer.mozilla.org/zh-CN/docs/Glossary/Digital_certificate)
