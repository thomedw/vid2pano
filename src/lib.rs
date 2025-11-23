use image::{DynamicImage, Rgba, RgbaImage};
use std::collections::VecDeque;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

#[wasm_bindgen]
pub struct PanoramaStitcher {
    frames: VecDeque<RgbaImage>,
    width: u32,
    height: u32,
}

#[wasm_bindgen]
impl PanoramaStitcher {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        console_error_panic_hook::set_once();
        Self {
            frames: VecDeque::new(),
            width: 0,
            height: 0,
        }
    }

    #[wasm_bindgen]
    pub fn add_frame(&mut self, image_data: &[u8], width: u32, height: u32) {
        console_log!("Adding frame: {}x{}", width, height);

        if self.width == 0 {
            self.width = width;
            self.height = height;
        }

        // Convert ImageData to RgbaImage
        let mut img = RgbaImage::new(width, height);
        for (i, pixel) in image_data.chunks_exact(4).enumerate() {
            let x = (i % width as usize) as u32;
            let y = (i / width as usize) as u32;
            img.put_pixel(x, y, Rgba([pixel[0], pixel[1], pixel[2], pixel[3]]));
        }

        self.frames.push_back(img);
        console_log!("Total frames: {}", self.frames.len());
    }

    #[wasm_bindgen]
    pub fn stitch(&mut self) -> Vec<u8> {
        console_log!("Starting stitch with {} frames", self.frames.len());

        if self.frames.is_empty() {
            return Vec::new();
        }

        if self.frames.len() == 1 {
            return self.frame_to_png_bytes(&self.frames[0]);
        }

        // Simple horizontal stitching for now
        // TODO: Implement proper feature detection and matching
        let panorama = self.simple_horizontal_stitch();

        self.frames_to_png_bytes(&panorama)
    }

    #[wasm_bindgen]
    pub fn clear(&mut self) {
        self.frames.clear();
        console_log!("Cleared all frames");
    }

    #[wasm_bindgen]
    pub fn frame_count(&self) -> usize {
        self.frames.len()
    }
}

impl PanoramaStitcher {
    fn simple_horizontal_stitch(&self) -> RgbaImage {
        // Simple approach: concatenate frames horizontally
        // This is a placeholder - real implementation needs feature matching

        let total_width = self.width * self.frames.len() as u32;
        let mut panorama = RgbaImage::new(total_width, self.height);

        for (i, frame) in self.frames.iter().enumerate() {
            let offset_x = (i as u32) * self.width;
            for y in 0..self.height {
                for x in 0..self.width {
                    if let Some(pixel) = frame.get_pixel_checked(x, y) {
                        panorama.put_pixel(offset_x + x, y, *pixel);
                    }
                }
            }
        }

        panorama
    }

    fn frame_to_png_bytes(&self, img: &RgbaImage) -> Vec<u8> {
        let mut bytes = Vec::new();
        let mut cursor = std::io::Cursor::new(&mut bytes);
        DynamicImage::ImageRgba8(img.clone())
            .write_to(&mut cursor, image::ImageOutputFormat::Png)
            .unwrap();
        bytes
    }

    fn frames_to_png_bytes(&self, img: &RgbaImage) -> Vec<u8> {
        self.frame_to_png_bytes(img)
    }
}
