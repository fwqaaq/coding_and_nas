
# 动态更改webgpu

>在上一节的例子中,`WGSL`将图形的形状以及颜色都固定了,不能动态的改变

1. `position.vert.wgsl`:动态的改变节点位置

   ```rust
   @stage(vertex)
   fn main(@location(0) position : vec3<f32>) -> @builtin(position) vec4<f32> {
       return vec4<f32>(position, 1.0);
   }
   ```

2. `color.frag.wgsl`:动态的改变颜色

   ```rust
   @group(0) @binding(0) var<uniform> color : vec4<f32>;
   
   @stage(fragment)
   fn main() -> @location(0) vec4<f32> {
       return color;
   }
   ```

> 在GPU管线中配置.创建缓冲区,传递内存中的数据,最终成为`vertexAttribute`和`uniform`等资源

1. 对图形的绘制
   * 为`vertex`配置缓冲区

   ```ts
   const vertex = new Float32Array([
       0.0, 0.5, 0.0,
       -0.5, -0.5, 0.0,
       0.5, -0.5, 0.0
   ])
   const vertexCount = 3
   export {vertex, vertexCount}
   ```

   * 创建缓冲区,传递内存中的数据

   ```ts
   const vertexBuffer = device.createBuffer({
     label: "GPUBuffer store vertex",
     size: triangle.vertex.byteLength,
     usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
     //mappedAtCreation: true
   })
   ```

   * 将提供的数据写入`GPUBuffer`

   ```ts
   device.queue.writeBuffer(vertexBuffer, 0, triangle.vertex)
   ```

2. 对颜色的绘制

   ```ts
   const colorBuffer = device.createBuffer({
     label: "GPUBuffer store rgba color",
     size: 4 * 4, // 4 * float32
     usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
   })
   device.queue.writeBuffer(colorBuffer, 0, new Float32Array([1, 1, 0, 1]))
 
   // create a uniform group for color
   const uniformGroup = device.createBindGroup({
     label: "Uniform Group with colorBuffer",
     layout: pipeline.getBindGroupLayout(0),
     entries: [
       {
         binding: 0,
         resource: {
           buffer: colorBuffer,
         },
       },
     ],
   })
   ```

> 在draw()中设置顶点缓冲区,设置组

   ```ts
  // set uniformGroup
  passEncoder.setBindGroup(0, pipelineObj.uniformGroup)
  // set vertex
  passEncoder.setVertexBuffer(0, pipelineObj.vertexBuffer)
   ```

> 动态的更改

   ```ts
   document
    .querySelector('input[type="color"]')
    ?.addEventListener("input", (e: Event) => {
      // get hex color string
      const color = (e.target as HTMLInputElement).value
      console.log(color)
      // parse hex color into rgb
      const r = +("0x" + color.slice(1, 3)) / 255
      const g = +("0x" + color.slice(3, 5)) / 255
      const b = +("0x" + color.slice(5, 7)) / 255
      // write colorBuffer with new color
      device.queue.writeBuffer(
        pipelineObj.colorBuffer,
        0,
        new Float32Array([r, g, b, 1])
      )
      draw(device, context, pipelineObj)
   })
   ```

## 总结步骤

1. 在异步函数中,请求逻辑设备

   ```ts
   const device = await adapter.requestDevice()
   ```

2. 创建缓冲区,传递内存中的数据,最终成为 vertexAttribute 和 uniform 等资源

   ```ts
   const buffer = device.createBuffer({})
   device.queue.writeBuffer()
   ```

3. 装配纹理和采样信息

   ```ts
   const texture = device.createTexture({})
   ```

4. 创建管线布局,传递绑定组布局对象

   ```ts
   const pipelineLayout = device.createPipelineLayout({})
   ```

5. 创建着色器模块

   ```ts
   const vertexShaderModule = device.createShaderModule({  })
   const fragmentShaderModule = device.createShaderModule({  })
   ```

6. 计算着色器可能用到的着色器模块

   ```ts
   const computeShaderModule = device.createShaderModule({  })
   ```

7. 这两个布局对象其实可以偷懒不创建,绑定组虽然需要绑定组布局以通知对应管线阶段绑定组的资源的样式,但是绑定组布局是可以由管线对象通过可编程阶段的代码自己推断出来绑定组布局对象的本示例代码保存了完整的过程

   ```ts
   /* 创建绑定组的布局对象 */
   const bindGroupLayout = device.createBindGroupLayout({})
   /* 传递绑定组布局对象 */
   const pipelineLayout = device.createPipelineLayout({})
   ```

8. **创建管线**:指定管线各个阶段所需的素材.其中有三个阶段可以传递着色器以实现可编程,即顶点、片段、计算
   * 每个阶段还可以指定其所需要的数据、信息,例如 buffer 等
   * 除此之外,管线还需要一个管线的布局对象,其内置的绑定组布局对象可以
   * 让着色器知晓之后在通道中使用的绑定组资源是啥样子的

   ```ts
   const pipeline = device.createRenderPipeline({})
   ```

9. 资源打组,将 buffer 和 texture 归到逻辑上的分组中,方便各个过程调用,过程即管线,
   * 此处必须传递绑定组布局对象,可以从管线中推断获取,也可以直接传递绑定组布局对象本身

   ```ts
   const bindGroup_0 = deivce.createBindGroup({})
   ```

10. 创建指令缓冲编码器对象

   ```ts
   const commandEncoder = device.createCommandEncoder()
   ```

11. 启动一个渲染通道编码器

   ```ts
   const renderPassEncoder = commandEncoder.beginRenderPass()   
   //也可以启动一个计算通道
   // const computePassEncoder = commandEncoder.beginComputePass({ }) 
   ```

13. 以渲染通道为例,使用 renderPassEncoder 完成这个通道内要做什么的顺序设置,例如

   ```ts
   // 第一道绘制,设置管线0、绑定组0、绑定组1、vbo,并触发绘制
   renderPassEncoder.setPipeline(renderPipeline_0)
   renderPassEncoder.setBindGroup(0, bindGroup_0)
   renderPassEncoder.setBindGroup(1, bindGroup_1)
   renderPassEncoder.setVertexBuffer(0, vbo, 0, size)
   renderPassEncoder.draw(vertexCount)
   // 第二道绘制,设置管线1、另一个绑定组并触发绘制
   renderPassEncoder.setPipeline(renderPipeline_1)
   renderPassEncoder.setBindGroup(1, another_bindGroup)
   renderPassEncoder.draw(vertexCount)
   ```

13. 结束通道编码

   ```ts
   renderPassEncoder.endPass()
   ```

14. 最后提交至`queue`,也即`commandEncoder`调用`finish`完成编码,返回一个指令缓冲

   ```ts
   device.queue.submit([
     commandEncoder.finish()
   ])
   ```
