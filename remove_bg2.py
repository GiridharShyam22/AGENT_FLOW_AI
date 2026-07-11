from rembg import remove
from PIL import Image

input_path = "/Users/giridharshyam/.gemini/antigravity-ide/brain/c671109c-281e-4394-851c-305bd4b32f90/agentflow_logo_1_1783762052882.png"
output_path = "logo_transparent.png"

try:
    with open(input_path, 'rb') as i:
        with open(output_path, 'wb') as o:
            input = i.read()
            output = remove(input)
            o.write(output)
    
    # Now crop it
    img = Image.open(output_path)
    cropped = img.crop((150, 150, 874, 874))
    cropped.save("/Users/giridharshyam/Desktop/techflow-support-bot/frontend/src/assets/logo.png")
    print("Background removed and cropped successfully")
except Exception as e:
    print(f"Error: {e}")
