from PIL import Image

def remove_background(img_path, out_path, tolerance=25):
    img = Image.open(img_path).convert("RGBA")
    datas = img.getdata()

    newData = []
    # The background is roughly RGB(15, 15, 15) to RGB(20, 20, 20)
    for item in datas:
        # Check if the pixel is dark (r, g, b all below tolerance)
        if item[0] < tolerance and item[1] < tolerance and item[2] < tolerance:
            newData.append((255, 255, 255, 0)) # transparent
        else:
            newData.append(item)
    
    img.putdata(newData)
    img.save(out_path, "PNG")

remove_background("/Users/giridharshyam/Desktop/techflow-support-bot/frontend/src/assets/logo.png", "/Users/giridharshyam/Desktop/techflow-support-bot/frontend/src/assets/logo.png")
print("Background removed via color keying")
