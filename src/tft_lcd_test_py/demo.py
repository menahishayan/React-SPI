from time import sleep

import board
import digitalio
from adafruit_rgb_display import ili9341  # pylint: disable=unused-import
from PIL import Image, ImageDraw

# Configure pins
cs_pin = digitalio.DigitalInOut(board.CE0)     # GPIO8, Pin 24
dc_pin = digitalio.DigitalInOut(board.D22)     # GPIO22, Pin 15
reset_pin = digitalio.DigitalInOut(board.D27)  # GPIO27, Pin 13

# SPI bus
spi = board.SPI()

# Display setup
disp = ili9341.ILI9341(
    spi,
    rotation=270,
    cs=cs_pin,
    dc=dc_pin,
    rst=reset_pin,
    baudrate=24000000,
    width=240,
    height=320,
)

if disp.rotation % 180 == 90:
    height = disp.width  # we swap height/width to rotate it to landscape!
    width = disp.height
else:
    width = disp.width  # we swap height/width to rotate it to landscape!
    height = disp.height

# Draw a test image
image = Image.new("RGB", (width, height), "black")
draw = ImageDraw.Draw(image)
draw.rectangle((0, 0, 100, 100), fill="green")
draw.text((120, 120), "HELLO", fill="white")

disp.image(image)

sleep(1)

image = Image.open("image.jpeg")

# Scale the image to the smaller screen dimension
image_ratio = image.width / image.height
screen_ratio = width / height
if screen_ratio < image_ratio:
    scaled_width = image.width * height // image.height
    scaled_height = height
else:
    scaled_width = width
    scaled_height = image.height * width // image.width
image = image.resize((scaled_width, scaled_height), Image.Resampling.BICUBIC)

# Crop and center the image
x = scaled_width // 2 - width // 2
y = scaled_height // 2 - height // 2
image = image.crop((x, y, x + width, y + height))

# Display image.
disp.image(image)
