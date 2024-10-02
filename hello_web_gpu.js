const canvas = document.querySelector("canvas");
const adapter = await navigator.gpu.requestAdapter();

if (!navigator.gpu) {
  throw new Error("WebGPU not supported on this browser.");
}

const device = await adapter.requestDevice();
const context = canvas.getContext("webgpu");
const canvasFormat = navigator.gpu.getPreferredCanvasFormat();
context.configure({
  device: device,
  format: canvasFormat,
});

const encoder = device.createCommandEncoder();
const pass = encoder.beginRenderPass({
  colorAttachments: [{
     view: context.getCurrentTexture().createView(),
     loadOp: "clear",
     clearValue: { r: 0, g: 0, b: 0.4, a: 1},
     storeOp: "store",
  }]
});

pass.end();

const commandBuffer = encoder.finish();
device.queue.submit([commandBuffer]);
device.queue.submit([encoder.finish()]);

