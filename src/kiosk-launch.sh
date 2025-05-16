#!/bin/bash

exec > >(tee -a /tmp/kiosk.log | systemd-cat -t kiosk-launch) 2>&1
set -x

export GTK_THEME=Adwaita:dark

chmod +x ~/.xinitrc
chmod 666 /dev/fb0 /dev/tty0
# sudo xinit ~/.xinitrc -- vt1
# Show splash (requires framebuffer access)
echo "[kiosk] Launching splash screen"
fbi -T 1 -d /dev/fb0 -noverbose -a /home/pi/splash.jpg || true
sleep 1

# Run Chromium via xinit with VT access
echo "[kiosk] Starting Chromium via xinit..."
xinit /home/pi/.xinitrc -- vt1

echo "[kiosk] xinit process exited"