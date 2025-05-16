# Notes to Self

| Display Pin     | RPi Pin | GPIO   | Notes                 |
| --------------- | ------- | ------ | --------------------- |
| VCC             | Pin 1   | 3.3V   | Power supply          |
| GND             | Pin 6   | GND    | Ground                |
| CS              | Pin 24  | GPIO8  | SPI chip select (CE0) |
| DC              | Pin 15  | GPIO22 | Data/Command          |
| RESET           | Pin 13  | GPIO27 | Reset                 |
| SDI (MOSI)      | Pin 19  | GPIO10 | SPI MOSI              |
| SCK             | Pin 23  | GPIO11 | SPI Clock             |
| LED (Backlight) | Pin 17  | 3.3V   | REQUIRED – backlight  |

- The red board IS ILI9341. ST7735R driver does not work.
- Be careful not to mistake D22 for pin 22
- Ensure cables aren't shaky
- Ensure rpi-spi is enabled via raspi-config and then reboot
- Tweaking rotation and height/width can have a huge impact on figuring out if the display even renders.
- BOTH LED and VCC are required
- 3v3 is sufficient. Do not use 5v unless it has an AMS regulator
- If the white flashes every time you run it but goes back to white, its likely pinout issue
- Shake the pins and be sure to check the corners of the frame for any pixels of what you're trying to render
- Easiest test is to pick a color and render a box on 50% width 50% height. If you see the color anywhere on the corners of the screen, pinout is correct but HxW or rotation is wrong.
