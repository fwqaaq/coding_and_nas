# ffmpeg 中使用的一些 trick

1. 去除音频中的一些杂音：
   * `highpass` 是去除 200hz 以下的噪音，`lowpass` 是去除 3000 以上的噪音
   * `afftdn` 是使用 FFT 噪声降低滤镜，其中 nf=-20 设置噪声阈值。值越低，降噪效果越强（但可能会影响有用音频）。

    ```bash
    ffmpeg -i input.ogg -af "highpass=f=200,lowpass=f=3000,afftdn=nf=-20" output.ogg
    ```

2. 音频混合和左右声道：

    * `[left]`、`[right]` 以及 `[aout]` 是一种引用，例如 `[left]` 是将第一个音频的**左通道**（`channel_layout=stereo:channels=FL`）分离
    * `[left][right]amerge=inputs=2[aout]` 是共有两个输入的音频流合并成一个新的流，名称叫做 `aout`

    > [!Note]
    > 最好是两个同样时长的文件，否则其中一个会以静音的方式合并，**合并的顺序**决定了流的左声道还是右声道。
    > `[left]` 引用在左边才是左声道，而不是名称

    ```bash
    ffmpeg -i "input1.mp3" -i "input2.mp3" \
    -filter_complex "[0:a]channelsplit=channel_layout=stereo:channels=FL[left];[1:a]channelsplit=channel_layout=stereo:channels=FL[right];[left][right]amerge=inputs=2[aout]" \
    -map "[aout]" -c:a libmp3lame output.mp3
    ```
