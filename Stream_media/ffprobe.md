# ffprobe

一般情况下我们会使用 `ffmpeg -i input.mp4` 来查看命令，但是这种方式的输出情况不是很理想，如果我们需要整洁详细的文件信息，我们需要使用 `ffprobe` 来指定输出文件

## Synax

```bash
ffprobe [OPTION] file
```

- `-show_format`：显示输入多媒体流的容器格式信息
- `-show_streams`：显示输入多媒体流中每一个流的信息
- `-i input_file`：指定输入文件
- `-print_format json`：json 形式输出
- `-of / -print_format`：指定任意一种形式输出 **default/compact/csv/flat/ini/json/xml**
- 以下指定 json 形式的信息输出**媒体流**和**容器格式**的信息，输入 `c.ts` 形式的文件

    ```bash
    ffprobe -print_format json -show_format -show_streams -i c.ts
    ```

## imformation

- 容器格式的信息（**-show_format**）

    ```toml
    [FORMAT]
    // 文件名
    filename=VID_20190811_113717.mp4
    // 容器中流的个数，即AVFormatContext->nb_streams
    nb_streams=2
    // 即AVFormatContext->nb_programs
    nb_programs=0
    // 封装格式，即AVFormatContext->iformat->name
    format_name=mov,mp4,m4a,3gp,3g2,mj2
    // 即AVFormatContext->iformat->long_name
    format_long_name=QuickTime / MOV
    // 即AVFormatContext->start_time，基于AV_TIME_BASE_Q，换算为秒
    start_time=0.000000
    // 即AVFormatContext->duration，基于AV_TIME_BASE_Q，换算为秒
    duration=10.508000
    // 单位字节，即avio_size(AVFormatContext->pb)
    size=27263322
    // 码率，即AVFormatContext->bit_rate
    bit_rate=20756240
    // 即AVFormatContext->probe_score
    probe_score=100
    [/FORMAT]
    ```

- 多媒体流的信息（**-show_streams**）

    ```toml
    [STREAM]
    // 当前流的索引信息,对应于AVStream->index
    index=0
    // AVCodecDescriptor * cd = avcodec_descriptor_get(AVStream->codecpar->codec_id)
    // 编码名称，即cd->name
    codec_name=h264
    // 编码全称，即cd->long_name
    codec_long_name=H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10
    // 一个编码参数，可以为Baseline、Main、High等，Baseline无B帧，Main及以后可以包含B帧
    // 通过avcodec_profile_name(AVStream->codecpar->codec_id, AVStream->codecpar->profile)获得
    profile=High
    // 流类型，即av_get_media_type_string(AVStream->codecpar->codec_type)
    codec_type=video
    // 即AVStream->codec->time_base
    codec_time_base=14777/877500
    // 通过宏av_fourcc2str(AVStream->codecpar->codec_tag)获得
    codec_tag_string=avc1
    // 对应AVStream->codecpar->codec_tag
    codec_tag=0x31637661
    // 有效区域的宽度，即AVStream->codecpar->width
    width=1920
    // 有效区域的高度，即AVStream->codecpar->height
    height=1080
    // 视频帧宽度，可能与上面的宽度不同，即AVStream->codec->coded_width，例如：当解码帧在输出前裁剪或启用低分辨率时
    coded_width=1920
    // 视频帧高度，可能与上面的高度不同，即AVStream->codec->coded_height，例如：当解码帧在输出前裁剪或启用低分辨率时
    coded_height=1088
    // 视频的延迟帧数，即AVStream->codecpar->video_delay
    has_b_frames=0
    // sar，单个像素的宽高比
    // FFmpeg提供了多个sar：AVStream->sample_aspect_ratio、AVStream->codecpar->sample_aspect_ratio、AVFrame->sample_aspect_ratio
    // 通过av_guess_sample_aspect_ratio获取最终的sar
    sample_aspect_ratio=1:1
    // dar，真正展示的图像宽高比，在渲染视频时，必须根据这个比例进行缩放
    // 通过av_reduce计算得到，par * sar = dar
    display_aspect_ratio=16:9
    // 像素格式，即av_get_pix_fmt_name(AVStream->codecpar->format)
    pix_fmt=yuvj420p
    // 编码参数，即AVStream->codecpar->level
    level=40
    // 额外的色彩空间特征，即av_color_range_name(AVStream->codecpar->color_range)，AVCOL_RANGE_MPEG对应tv，AVCOL_RANGE_JPEG对应pc
    color_range=pc
    // YUV彩色空间类型，即av_color_space_name(AVStream->codecpar->color_space)
    color_space=bt470bg
    // 颜色传输特性，即av_color_transfer_name(AVStream->codecpar->color_trc)
    color_transfer=smpte170m
    // 即av_color_primaries_name(AVStream->codecpar->color_primaries)
    color_primaries=bt470bg
    // 色度样品的位置，即av_chroma_location_name(AVStream->codecpar->chroma_location)
    chroma_location=left
    // 交错视频中字段的顺序，即AVStream->codecpar->field_order
    field_order=unknown
    // av_timecode_make_mpeg_tc_string处理AVStream->codec->timecode_frame_start获得
    timecode=N/A
    // 参考帧数量，即AVStream->codec->refs
    refs=1
    is_avc=true
    // 表示用几个字节表示NALU的长度
    nal_length_size=4
    id=N/A
    // 当前流的基本帧率，这个值仅是一个猜测，对应于AVStream->r_frame_rate
    r_frame_rate=30/1
    // 平均帧率，对应于AVStream->avg_frame_rate
    avg_frame_rate=438750/14777
    // AVStream的时间基准，即AVStream->time_base
    time_base=1/90000
    // 流开始时间，基于time_base，即AVStream->start_time
    start_pts=0
    // 转换（start_pts * time_base）之后的开始时间，单位秒
    start_time=0.000000
    // 流时长，基于time_base，即AVStream->duration
    duration_ts=945728
    // 转换（duration_ts * time_base）之后的时长，单位秒
    duration=10.508089
    // 码率，即AVStream->codecpar->bit_rate
    bit_rate=19983544
    // 最大码率，即AVStream->codec->rc_max_rate
    max_bit_rate=N/A
    // Bits per sample/pixel，即AVStream->codec->bits_per_raw_sample
    bits_per_raw_sample=8
    // 视频流中的帧数，即AVStream->nb_frames
    nb_frames=312
    nb_read_frames=N/A
    nb_read_packets=N/A
    // 下面TAG为AVStream->metadata中的信息
    // 逆时针的旋转角度（相当于正常视频的逆时针旋转角度）
    TAG:rotate=90
    // 创建时间
    TAG:creation_time=2019-08-11T03:37:28.000000Z
    // 语言
    TAG:language=eng
    TAG:handler_name=VideoHandle
    // SIDE_DATA为AVStream->side_data数据
    [SIDE_DATA]
    // side_data数据类型，Display Matrix表示一个3*3的矩阵，这个矩阵需要应用到解码后的视频帧上，才能正确展示
    side_data_type=Display Matrix
    displaymatrix=
    00000000:            0       65536           0
    00000001:       -65536           0           0
    00000002:            0           0  1073741824
    // 顺时针旋转90度还原视频
    rotation=-90
    [/SIDE_DATA]
    [/STREAM]
    [STREAM]
    // 当前流的索引信息,对应于AVStream->index
    index=1
    // AVCodecDescriptor * cd = avcodec_descriptor_get(AVStream->codecpar->codec_id)
    // 编码名称，即cd->name
    codec_name=aac
    // 编码全称，即cd->long_name
    codec_long_name=AAC (Advanced Audio Coding)
    // 通过avcodec_profile_name(AVStream->codecpar->codec_id, AVStream->codecpar->profile)获得
    profile=LC
    // 流类型，即av_get_media_type_string(AVStream->codecpar->codec_type)
    codec_type=audio
    // 即AVStream->codec->time_base
    codec_time_base=1/48000
    // 通过宏av_fourcc2str(AVStream->codecpar->codec_tag)获得
    codec_tag_string=mp4a
    // 对应AVStream->codecpar->codec_tag
    codec_tag=0x6134706d
    // 采样点格式，通过av_get_sample_fmt_name(AVStream->codecpar->format)获取
    sample_fmt=fltp
    // 采样率，即AVStream->codecpar->sample_rate
    sample_rate=48000
    // 通道数，即AVStream->codecpar->channels
    channels=2
    // 通道布局，与channels是相对应，通过av_bprint_channel_layout获取，stereo表示立体声
    channel_layout=stereo
    // 每个采样点占用多少bit，即av_get_bits_per_sample(par->codec_id)
    bits_per_sample=0
    id=N/A
    r_frame_rate=0/0
    avg_frame_rate=0/0
    // AVStream的时间基准，即AVStream->time_base
    time_base=1/48000
    // 流开始时间，基于time_base，即AVStream->start_time
    start_pts=0
    // 转换（start_pts * time_base）之后的开始时间，单位秒
    start_time=0.000000
    // 流时长，基于time_base，即AVStream->duration
    duration_ts=502776
    // 转换（duration_ts * time_base）之后的时长，单位秒
    duration=10.474500
    // 码率，即AVStream->codecpar->bit_rate
    bit_rate=156002
    // 最大码率，即AVStream->codec->rc_max_rate
    max_bit_rate=156000
    // Bits per sample/pixel，即AVStream->codec->bits_per_raw_sample
    bits_per_raw_sample=N/A
    // 音频流中的帧数，即AVStream->nb_frames
    nb_frames=491
    nb_read_frames=N/A
    nb_read_packets=N/A
    TAG:creation_time=2019-08-11T03:37:28.000000Z
    TAG:language=eng
    TAG:handler_name=SoundHandle
    [/STREAM]
    ```

  - `SAR(Sample Aspect Ratio)`：单个像素宽高比，即每个像素宽度与高度的比值，所以可以认为像素不是正方形的
  - `PAR(Pixel Aspect Ratio)`：像素数宽高比，图像的横向采集点数与纵向采集点数的比值，即像素个数的比值
  - `DAR(Display Aspect Ratio)`：显示宽高比，图像最终展示的宽高比，播放器在渲染视频帧时，需要保持DAR的比例。
  - **DAR = PAR * SAR**
  - 例如：每个方格代表一个像素，宽度为 5 个像素组成，高度为4个像素组成，即 `PAR=5 : 4`。 假设图像的显示宽度为160，高度为120，即 `DAR=4 : 3`。那么可以计算出 `SAR = DAR / PAR = 16 : 15`
- 展示单独信息（-show_entries，将 `-show_format` 中的信息按单独条目输出）

    > 只输出 `size` 信息

    ```bash
    ffprobe -v error -show_entries format=size -of default=noprint_wrappers=1 input.mp4
    ```

  - `v` 参数是日志输出级别
  - `error` 则略去了 build 和 generic 信息，暴露 error 错误
  - `print_format` 则是输出结果格式

    > 输出 width*height

    ```bash
    ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 out.mp4
    ```
