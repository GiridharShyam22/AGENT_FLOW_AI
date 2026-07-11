from PIL import Image, ImageChops

def trim(im):
    # Find bounding box of non-black pixels
    bg = Image.new(im.mode, im.size, (15, 15, 15)) # The background is dark grey/black
    diff = ImageChops.difference(im, bg)
    diff = ImageChops.add(diff, diff, 2.0, -100)
    # convert to grayscale and get bounding box
    bbox = diff.convert("L").getbbox()
    if bbox:
        # add padding
        padding = 40
        return im.crop((max(0, bbox[0]-padding), max(0, bbox[1]-padding), min(im.width, bbox[2]+padding), min(im.height, bbox[3]+padding)))
    return im

img_path = "/Users/giridharshyam/.gemini/antigravity-ide/brain/c671109c-281e-4394-851c-305bd4b32f90/agentflow_logo_1_1783762052882.png"
img = Image.open(img_path)

# Manual crop is safer if background has noise or gradients
# The image is 1024x1024. Let's crop away the outer 150px on all sides.
cropped = img.crop((150, 150, 874, 874))
cropped.save("/Users/giridharshyam/Desktop/techflow-support-bot/frontend/src/assets/logo.png")
print("Saved full logo with text to logo.png")
