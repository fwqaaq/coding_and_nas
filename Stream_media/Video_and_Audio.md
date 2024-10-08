# video and audio

## 概念

1. 容器：
    - 视频本身其实是一个容器（container），由视频轨，音频轨，字幕轨等组成。常见的视频容器由以下几种格式：MP4、MKV、Webm 以及 AVI
    - 使用 `ffmpeg -formats` 可以查看 ffmpeg 支持的格式
2. 编码格式
    - 视频和音频都需要经过编码，才能保存成文件。不同的编码格式（CODEC），有不同的压缩率，会导致文件大小和清晰度的差异。
        1. 常用的编码格式：H.262、H.264、H.265
        2. 上面的编码格式都是有版权的，但是可以免费使用。此外，还有几种无版权的视频编码格式：VP8、VP9、AV1
        3. 常用的音频编码格式：MP3、AAC
    - 使用 `ffmpeg -codecs` 可以查看 FFmpeg 支持的编码格式，包括视频，音频
3. 编码器
    - 编码器（encoders）是实现某种编码格式的库文件。只有安装了某种格式的编码器，才能实现该格式视频/音频的编码和解码。
        1. FFmpeg 内置的视频编码器：`libx264`：最流行的开源 H.264 编码器；`NVENC`：基于 NVIDIA GPU 的 H.264 编码器；`libx265`：开源的 HEVC 编码器；`libvpx`：谷歌的 VP8 和 VP9 编码器；`libaom`：AV1 编码器
        2. 音频编码器：`libfdk-aac`、`aac`
    - 使用 `ffmpeg -encoders` 可以查看已安装的编码器
4. 常见的音视频编码组合（适用于 **1080p**）
    1. MP4 封装：H264 视频编码 + AAC 音频编码
    2. WebM 封装：VP8 视频编码 + Vorbis 音频编码
    3. OGG 封装：Theora 视频编码 + Vorbis 音频编码
5. 720p 以及 1080p
    - `p` 表示**垂直分辨率**，也就是高度有多少像素数
        - **720**P 是 `1280*720*=921600`，即分辨率为 921600，即大约 92 万像素，921600 接近 100 万像素（1280是按照**16:9**算出来的，P是逐行扫描的简称）。
        - **1080**P 是 1`1920*1080=2073600`，即分辨率为 2073600，即大约 200 万像素，所以一般 200 万像素又称 1080P
        - 720p 和 1080p 表示的是像素的总行数，不管屏幕多大，像素的总行数是不变的，
    - `k` 表示的是**水平分辨率，也就是水平方向有多少像素数**
        - 2K,4K 等，表示的是“**视频像素的总列数**”，如 4K, 表示的是视频有 4000 列像素数，具体是 3840 或 4096 列。4K分辨率的摄像机通常像素数是 `3840**2160` 或 `4096**2160` 。
6. **不同分辨率之间的区别及含义**
    - 1080p 和 720p 其实是指垂直像素数，分辨率除去垂直像素，还需要考虑到水平像素数。按照 16:9（宽 : 高）的比例计算，720p 的水平像素数为 720 ÷ 9 × 16 = 1280，总计像素为 921600 像素即大约为 92 万像素。1080p 具有 1920 个水平像素，总计2073600像素即约 200 万像素，是 720p 的两倍多。
    - 而像素越多视频就越清晰，所以 1080p 比 720p 的视频更加清晰。
    - 1080p 和 1080i 的区别
        - i 和 p 是指扫描方式，i 表示隔行扫描，p 则表示逐行扫描，以 1080 的视频举例：
        - **1080i**：`1920 x 1080` 分辨率。隔行扫描模式下的高清图像是隔行显示的。每一个奇数行图像都在每一偶数行图像后面显示出来。比如将 60 帧分成两部分，奇数帧只扫描 1,3,5,7,9… 行，偶数帧只扫描 2,4,6,8,10… 行。理论上人眼是察觉不出来画面不连续，反而是由于视觉残留，能自动将两帧叠加在一起。
        - **1080p**：`1920x1080` 分辨率。和 1080i 的区别就在于 1080p 不是隔行扫描，是逐行扫描。每一线都同时表现在画面上，因此比隔行扫描电视更加的平滑。

        [https://opentalk-blog.b0.upaiyun.com/prod/2020-08-26/f98ef735fdb8565380ecfd6225987917](https://opentalk-blog.b0.upaiyun.com/prod/2020-08-26/f98ef735fdb8565380ecfd6225987917)

7. **H.264**
    - **H.264由视频编码层（VCL）和网络适配层（NAL）组成。**
        - VCL：H264编码/压缩的核心，主要负责将视频数据编码/压缩，再切分。
        - NALU = NALU header + NALU payload
    - **VCL 管理 H264 视频数据**
        1. 压缩：预测（帧内预测和帧间预测）-> DCT变化和量化 -> 比特流编码；
        2. 切分数据，主要为了第三步。**切片**（slice）、“**宏块**（macroblock）”是在 VCL 中的概念，一方面提高编码效率和降低误码率、另一方面提高网络传输的灵活性。
        3. 包装成『NAL』
    - **I 帧、P 帧和 B 帧**
        - I 帧（Intra-coded picture，帧内编码图像帧），表示关键帧，采用类似 JPEG 压缩的 DCT（Discrete Cosine Transform，离散余弦变换）压缩技术，可达 1/6 压缩比而无明显压缩痕迹；
        - P 帧（Predictive-coded picture，前向预测编码图像帧），表示的是跟之前的一个关键帧或 P 帧的差别，P 帧是参考帧，它可能造成解码错误的扩散；
        - B 帧（Bidirectionally predicted picture，双向预测编码图像帧），本帧与前后帧（I 或 P 帧）的差别，B 帧压缩率高，但解码耗费 CPU；
        - IDR 帧（Instantaneous Decoding Refresh，即时解码刷新）：首个 I帧，是立刻刷新，使错误不致传播，IDR 导致 DPB（DecodedPictureBuffer 参考帧列表——这是关键所在）清空；在 IDR 帧之后的所有帧都不能引用任何 IDR 帧之前的帧的内容；IDR 具有随机访问的能力，播放器可以从一个 IDR 帧播放。
        - GOP（Group Of Picture，图像序列）：两个 I 帧之间是一个图像序列，一个 GOP 包含一个 I 帧
    - **解码时间戳和显示时间戳**
        - DTS（Decoding Time Stamp，解码时间戳解）：读入内存中的比特流在什么时候开始送入解码器中进行解码
        - PTS（Presentation Time Stamp，显示时间戳）：解码后的视频帧什么时候被显示出来
8. YUV&RGB

    [音视频入门系列-图像篇（YUV 和 RGB）](https://mp.weixin.qq.com/s?__biz=Mzg2MzA0NjM3Ng==&mid=2247483939&idx=1&sn=bd3867f3d0bc0fe0648bbcb349bbcbb4&chksm=ce7fdda4f90854b2136373bc01e8e4de2207c7fd959be1b35ec62e67f402d04c528d24fe6587&scene=21#wechat_redirect)

>[!TIP]
>对于一些视频在某些软件发送成文件，而不是可以及时播放的视频的问题，例如 Telegram 仅支持 MP4 格式，并且编码只能是 H264 格式的（libx264 编码），如果是其他格式的编码都不能直接播放，只能是文件。

### video 基础原理

- 视频参数
  - `-vframes`设置要输出的视频帧数
  - `-b:v`视频码率
  - `-qp`：（Constant Quantizer）恒定量化器模式
  - `-r`设定帧速率
  - `-s`设定画面的宽与高
  - `-aspect aspect` 设置横纵比，常见的纵横比 `16:9`、`4:3`、`16:10`、`5:4`

    ```bash
    ffmpeg -i test.mp4 -vframes 300 -b:v 300k -r 30 -s 640x480 -aspect 16:9 out.mp4
    ```

#### **比特率**

> 英文为 `bit rate`，也叫码率。描述每秒钟输出多少 KB 的参数，单位是 `Kbps`，也就是 kbit/s，**8Kbit/s = 1KB/s**。也就是说 **800Kbps** 意思就是每秒视频就要占用 100KB 磁盘空间。对于音频文件也存在比特率，同理。压缩同一个视频，视频比特率越大，文件体积越大。视频比特率越大，画质越好，马赛克越少。

#### **帧数（`-r`）**

- 帧数，又被叫做帧率，指的是每秒钟播放的图片数，单位 `fps`（英文：Frames Per Second），每秒的帧数或者帧率表示视频文件或者图形处理器场景时每秒钟能够更新的次数。
- 高的帧率可以得到更流畅、更逼真的画面。一般来说 30fps 就是可以接受的，但是将性能提升至 60fps 则可以明显提升交互感和逼真感，但是一般来说超过 75fps 一般就不容易察觉到有明显的流畅度提升了。如果帧率超过屏幕刷新率只会浪费图形处理的能力，因为显示器不能以这么快的速度更新，这样超过刷新率的帧率就浪费掉了。
- 在同一视频，同一码率的情况下，帧数越大，则画质越不好。尤其是运动的画面。因为每张画面会分担每秒有限的文件体积，如果画面越多，那么每张画面所能表现的内容就越有限。
- 当画面的 FPS 达到 60帧 / 秒时，已经能满足绝大部分应用需求。一般情况下，如果能够保证游戏画面的平均 FPS 能够达到 30帧 / 秒，那么画面已经基本流畅；能够达到 50帧 / 秒，就基本可以体会到行云流水的感觉了。一般人很难分辨出 60帧 / 秒与 100帧 / 秒有什么不同。

```bash
ffmpeg .. -r 30 ..
```

#### **分辨率**

- 分辨率**表示画面的大小，单位是像素 px**。
- 和编码率的关系：越高的分辨率，需要越高的编码率，因为图像的细节多了，需要的文件体积也应该增大，否则还不如画面小一些，你会发现同一码率，画面越大，图像的马赛克程度越明显。

#### 码率控制模式

- `-qp`，在此模式下，画质分为 `0...20...40...51`,0是无损的级别，但是它的文件体积是最大的，一般用于无损压缩视频

    ```bash
    # 快速编码
    ffmpeg -i input -c:v libx264 -preset ultrafast -qp 0 out.mkv
    # 搞压缩比
    ffmpeg -i input -c:v libx264 -preset veryslow -qp 0 out.mkv
    ```

- `-crf`:恒定速率因子模式
  - 此模式会根据人眼的特点给予特定的量化参数，所以画面的质量有的高一点有的低一点
  - 所以可以降低一点码率到视觉敏感的范围
- `-b` 固定目标码率模式，编码器或者视图让**文件的整体码率与我们给定的码率相等**
  - `码率(kbps)=文件大小(KB) * 8 / 时间(秒)`，设置码率就确定了文件的整体大小
  - 此模式基于 VBR(Variable Bit Rate/动态比特率)的方式来编码,但是在网络不好情况下很容易造成花屏
  - 现在的网络视频基本都是使用 ABR（Average Bit Rate/平均比特率）的方式来编码
  - CBR（Constant Bit Rate/恒定比特率）, 其实就是在 VBR 的基础上固定一些数值（没人用）

  ```bash
  #... -b:v 4000k -minrate 4000k -maxrate 4000k -bufsize 1835k ...
  ```

### audio 基础原理

[音频](https://so.csdn.net/so/search?q=%E9%9F%B3%E9%A2%91&spm=1001.2101.3001.7020) 指人耳可以听到的声音频率在 `20HZ~20kHz` 之间的**声波**

- 音频参数
  - `-frames:a number` 设置音频输出的帧数（`-aframes number`）
  - `-b:a` 音频码率（或 `-ab`），缺省则为 **200kb/s**
    - 设置音频码率，声音比特率，-ac 设为立体声时要以一半比特率来设置，比如 192kbps 的就设置成 96，高品质音乐建议 160kbps（80） 以上
  - `-q:a quality` 设置音频的质量（`-aq`）
  - `-ar rate` 设置音频采样率（以 Hz 为单位）
  - `-ac channels` 设置音频通道数,**默认值为 1**
  - `-vol volume` 设置音频音量（256=normal）

    ```bash
    ffmpeg -i test.mp4 -b:a 192k -ar 48000 -ac 2 -aframes 200 out2.mp3
    ```

#### PCM

> PCM（Pulse Code Modulation，脉冲编码调制）音频数据是未经压缩的音频采样数据裸流，它是由模拟信号经过**采样**、**量化、编码转换成的标准数字音频数据。一般各种音乐播放器都会将 mp3、aac 等格式转换成 pcm 格式再进行播放**

1. 采样率：每秒钟采样的样本数。比如我们常说的 44.1kHz，即每秒钟采样 44100次。
2. 量化：将采样信号数据四舍五入到一个可用整数表示的过程。（位深）
3. 编码：将量化后的信号转换成二进制数据。

> **描述 PCM 数据的6个参数：**

1. **采样频率**（Sample Rate）。8kHz（电话）、44.1kHz（CD）、48kHz（DVD）。
2. **量化位数**（Sample Size）。常见值为 8-bit、16-bit。
3. **通道个数**（Number of Channels ）。常见的音频有立体声（stereo）和单声道（mono）两种类型，立体声包含左声道和右声道。另外还有环绕立体声等其它不太常用的类型。
4. **样本数据是否是有符号位**（Sign），比如用一字节表示的样本数据，有符号的话表示范围为 -128 ~ 127，无符号是 0 ~ 255。
5. **字节序**（Byte Ordering）。字节序是 little-endian 还是 big-endian。通常均为 little-endian。
6. **整形或浮点型**（Integer Or Floating Point）。大多数格式的 PCM 样本数据使用整形表示，而在一些对精度要求高的应用方面，使用浮点类型表示 PCM 样本数据。

#### **比特率**（与视频同）

> 英文为 `bit rate`，也叫码率。描述每秒钟输出多少 KB 的参数，单位是 `Kbps`，也就是 kbit/s，**8Kbit/s = 1KB/s**。也就是说 **800Kbps** 意思就是每秒视频就要占用 100KB 磁盘空间。对于音频文件也存在比特率，同理。压缩同一个视频，视频比特率越大，文件体积越大。视频比特率越大，画质越好，马赛克越少。

- 对于**音乐:**`64（AAC）/ 96（MP3）kbps` 是一个通用设置，对于大多数听众来说听起来不错。这是播客的标准比特率，在大多数现代设备（包括智能扬声器和移动设备）上听起来很棒。如果需要考虑带宽成本，则可以考虑使用较低的设置。为了增强聆听效果，请提高音量。
- 对于**通话:**`32（AAC）/ 64（MP3）kbps`是一个很好的标准设置。如果您特别注重预算，则可以将谈话广播设置为较低的设置，很少有人会注意到这种差异。

请注意，您可以选择对AAC使用**自适应比特率安装**，这会根据侦听器的连接质量来更改比特率。共有三种自适应比特率选项（**增强，标准，经济**），每个选项都提供了三个与连接有关的比特率级别。

#### 采样频率（`-ar`）

- 指取样频率, 指每秒钟取得声音样本的次数。采样频率越高，声音的质量也就越好，声音的还原也就越真实，但同时它占的资源比较多。由于人耳的分辨率很有限，太高的频率并不能分辨出来。
- **22050** 的采样频率是常用的, **44100** 已是 CD 音质, 超过 **48000** 或 **96000** 的采样对人耳已经没有意义。这和电影的每秒 24 帧图片的道理差不多。

    |  | 增强型音乐（古典音乐，优质服务等） | 标准音乐/混合音乐（常规流行音乐。前40名，演讲等） | 谈话广播（独家谈话广播。） |
    | --- | --- | --- | --- |
    | AAC比特率（自适应比特率） | 96 kbps（256/128/64 kbps） | 64 kbps（128/64/32 kbps） | 32 kbps（56/40/24 kbps） |
    | MP3比特率 | 128 kbps的 | 96 kbps | 64 kbps的 |
    | 采样率 | 44.1 kHz立体声，除非您的素材是48 kHz立体声（在这种情况下，请使用48）。 | 44.1 kHz立体声，除非您的素材是48 kHz立体声（在这种情况下，请使用48）。 | 单声道22.05 kHz |

#### 采样位数

即采样值或取样值（声音的连续强度被数字表示后可以分为多少级，即将采样样本幅度量化）。它是用来衡量声音波动变化的一个参数，也可以说是声卡的分辨率。它的数值越大，分辨率也就越高，所发出声音的能力越强。

- `8 bit`：只能记录 256 个数，只能将振幅划分成 256 个等级
- `16 bit`：细到 65536 个数
- `32 bit`：把振幅细分到 4294967296 个等级
- 如果是双声道(stereo)，采样就是双份的，文件也差不多要大一倍。

#### 通道数（`-ac`）

- 即声音的通道的数目。常有单声道和立体声之分，单声道的声音只能使用一个喇叭发声（有的也处理成两个喇叭输出同一个声道的声音），立体声可以使两个喇叭都发声（一般左右声道有分工） ，更能感受到空间效果，当然还有更多的通道数。
  - **单声道**：`mono`（**-ac 1**）
  - **双声道**：`stereo`（**-ac 2**），最常见的类型，包含左声道以及右声道
  - **2.1 声道**：在双声道基础上加入一个低音声道（**-ac 4**）
  - **5.1 声道**：包含一个正面声道、左前方声道、右前方声道、左环绕声道、右环绕声道、一个低音声道，最早应用于早期的电影院（**-ac 6**）  - **7.1 声道**：在 5.1 声道的基础上，把左右的环绕声道拆分为左右环绕声道以及左右后置声道，主要应用于 BD 以及现代的电影院

#### 音频码率=采样率**位深**声道数目

音频码率 = 44.1khz \* 16bit \* 2 = 1411.2kbps

#### AAC

> AAC（Advanced Audio Coding，高级音频编码）一种声音数据的文件压缩格式。AAC分为**ADIF**和**ADTS**两种文件格式

- **ADIF：Audio Data Interchange Format** 音频数据交换格式。这种格式的特征是可以确定的找到这个音频数据的开始，不需进行在音频数据流中间开始的解码，即它的解码必须在明确定义的开始处进行。故这种格式常用在磁盘文件中。
- **ADTS：Audio Data Transport Stream** 音频数据传输流。这种格式的特征是它是一个有同步字的比特流，解码可以在这个流中任何位置开始。
