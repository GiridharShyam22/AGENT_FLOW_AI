from PIL import Image

# Open the image
img_path = "/Users/giridharshyam/.gemini/antigravity-ide/brain/c671109c-281e-4394-851c-305bd4b32f90/agentflow_logo_1_1783762052882.png"
try:
    img = Image.open(img_path)
    # The image is 1024x1024. The symbol is roughly in the center-top.
    # Let's crop it. Left, Upper, Right, Lower
    # upper = 200, lower = 600, left = 250, right = 770
    cropped = img.crop((250, 180, 770, 620))
    cropped.save("/Users/giridharshyam/Desktop/techflow-support-bot/frontend/src/assets/logo.png")
    print("Cropped successfully to frontend/src/assets/logo.png")
except Exception as e:
    print(f"Error: {e}")
