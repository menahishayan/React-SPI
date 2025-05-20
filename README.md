# Raspberry Pi ILI9341 Chromium Kiosk Setup (Console Mode)

This guide documents the complete setup process for running a full-screen Chromium kiosk on a 320x240 ILI9341 SPI display using Raspberry Pi OS in console mode (no desktop environment). Verified on Raspberry Pi OS Bookworm.

---

## 🛠️ 1. Enable Console Mode (No Desktop)

```bash
sudo systemctl set-default multi-user.target
```

---

## ⚙️ 2. Enable SPI, Disable KMS, Configure Display Overlay

### Edit `/boot/firmware/config.txt`

```bash
sudo nano /boot/firmware/config.txt
```

#### 🔧 Disable KMS and enable FKMS (legacy framebuffer support)

Comment or remove this if present:

```ini
# dtoverlay=vc4-kms-v3d
```

Add this instead:

```ini
dtoverlay=vc4-fkms-v3d
```

#### 🔧 Add ILI9341 SPI Display Overlay

```ini
dtoverlay=fbtft,spi0-0,ili9341,bgr,reset_pin=27,dc_pin=22,rotate=270,speed=64000000
```

---

## 🖥️ 3. Keep Console Output on SPI Display

### Edit `/boot/firmware/cmdline.txt`

```bash
sudo nano /boot/firmware/cmdline.txt
```

Append the following (keep everything on one line):

```txt
fbcon=map:1 fbcon=font:VGA8x8
```

---

## 🔁 4. Reboot to Apply Changes

```bash
sudo reboot
```

---

## 🧪 5. Test Image Rendering on SPI Screen

```bash
sudo apt install fbi
sudo fbi -T 1 -d /dev/fb0 -noverbose -a /path/to/image.jpg
```

✅ If you see the image, framebuffer `/dev/fb0` is working.

---

## 🧰 6. Install X11 and Chromium

```bash
sudo apt install xserver-xorg xinit x11-xserver-utils xterm xserver-xorg-video-fbdev chromium-browser
```

---

## 🧱 7. Configure Xorg to Use SPI Framebuffer

### Create `/etc/X11/xorg.conf.d/99-fbtft.conf`

```bash
sudo mkdir -p /etc/X11/xorg.conf.d
sudo nano /etc/X11/xorg.conf.d/99-fbtft.conf
```

Paste this config:

```ini
Section "Device"
    Identifier "FBDEV"
    Driver "fbdev"
    Option "fbdev" "/dev/fb0"
    Option "ShadowFB" "false"
EndSection

Section "Screen"
    Identifier "Screen0"
    Device "FBDEV"
    DefaultDepth 16
    SubSection "Display"
        Depth 16
        Modes "320x240"
    EndSubSection
EndSection

Section "Monitor"
    Identifier "Monitor0"
EndSection

Section "ServerLayout"
    Identifier "DefaultLayout"
    Screen "Screen0"
EndSection
```

---

## ✏️ 8. Create Minimal `.xinitrc`

### Edit `~/.xinitrc` with the following content:

```sh
#!/bin/sh

sudo -u pi bash <<EOF
  source ~/.bashrc

  export NVM_DIR="\$HOME/.nvm"
  [ -s "\$NVM_DIR/nvm.sh" ] && \. "\$NVM_DIR/nvm.sh"

  cd ~/Desktop/Projects/MagicMirror

  npm run start
EOF
```

Make it executable:

```bash
chmod +x ~/.xinitrc
```

---

## 🚀 9. Create Kiosk Launch Script

Place the following script at `/usr/local/bin/kiosk-launch.sh`:

```bash
sudo nano /usr/local/bin/kiosk-launch.sh
```

Paste:

```bash
#!/bin/bash
export GTK_THEME=Adwaita:dark

chmod +x ~/.xinitrc
chmod 666 /dev/fb0 /dev/tty0
# sudo xinit ~/.xinitrc -- vt1
# Show splash (requires framebuffer access)
echo "[kiosk] Launching splash screen"
fbi -T 1 -d /dev/fb0 -noverbose -a \
    /home/pi/splash.jpg || true
sleep 1

# Run Chromium via xinit with VT access
echo "[kiosk] Starting Chromium via xinit"
xinit /home/pi/.xinitrc -- vt1
```

Make it executable:

```bash
sudo chmod +x /usr/local/bin/kiosk-launch.sh
```

---

## 🛡️ 10. Create systemd Service for Kiosk

Create the service file at `/etc/systemd/system/chromium-kiosk.service`:

```bash
sudo nano /etc/systemd/system/chromium-kiosk.service
```

Paste:

```ini
[Unit]
Description=Start Chromium Kiosk on 
            ILI9341 with Splash
After=network-online.target
Wants=network-online.target

[Service]
StandardOutput=journal
StandardError=journal
ExecStart=/usr/local/bin/kiosk-launch.sh
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable chromium-kiosk.service
sudo systemctl start chromium-kiosk.service
```

---

## 🏁 Done!

Tests:

```bash
ls /dev/fb*
cat /sys/class/graphics/fb0/name
# Confirm framebuffer is bound to SPI
cat /sys/class/graphics/fb0/name

# Confirm screen resolution
cat /sys/class/graphics/fb0/virtual_size

# Confirm pixel depth
cat /sys/class/graphics/fb0/bits_per_pixel

# List framebuffer devices
ls -l /dev/fb*

# Confirm current TTY (helps with fbi and X)
tty

```

Fix after reboot:

```bash
chmod +x ~/.xinitrc
sudo systemctl set-default multi-user.target
sudo chmod 666 /dev/fb0 /dev/tty0
sudo reboot
sudo xinit ~/.xinitrc -- vt1
```
