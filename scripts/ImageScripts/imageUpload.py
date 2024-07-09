import psycopg2
from cutter import cut_tiles, calculate_max_zoom_level
from PIL import Image
import random
import os

conn = psycopg2.connect(dbname="visualization", user="postgres", password="samrith123")
cursor = conn.cursor()

#Floorid, imgWidth, imgHeight, zoomNum, tileNum, imgNum, floorImg



for i in range(50):
    floorPath = f"./Floors/{i+267}.png"
    maxZoomDict = calculate_max_zoom_level(floorPath)
    maxZoom = list(maxZoomDict.keys())[-1]
    if(maxZoom > 4):
        maxZoom = 4
    imgSize = maxZoomDict[maxZoom]
    
    os.mkdir(f"/home/samrith/Downloads/Coding/visualization/scripts/ImageScripts/Floorplans/map{i}")

    floorMaps = cut_tiles(floorPath, maxZoom, f"./Floorplans/map{i}", "png")
    

    zoomNum = 0
    for fMap in floorMaps:
        tileNum = 0
        for tile in fMap:
            binaryNum = 0
            for binary in tile:
                cursor.execute("INSERT INTO floorplans(floorId, imgWidth, imgHeight, zoomNum, tileNum, imgNum, floorImg) VALUES(%s, %s, %s, %s, %s, %s, %s)", (i+1, imgSize[0], imgSize[0], zoomNum, tileNum, binaryNum, psycopg2.Binary(binary)))
                conn.commit()    
                binaryNum += 1
            tileNum += 1
        zoomNum += 1

#317
for y in range(317):
    roomLoc = []
    roomLoc.append((random.randint(-84, 84)))
    roomLoc.append((random.randint(-160, 160)))
    cursor.execute("INSERT INTO roomlocs(location, locs) VALUES(%s, %s)", (y+1, roomLoc))
    conn.commit()   
    
    


#open(f"./Testplans/map0/floor{binaryNum}.png", "wb").write(binary)
#binaryNum += 1        
#curImage = Image.frombytes("RGBA", imgSize, binary, 'raw')
#curImage.show()
#imgData = open("../frontend/public/Floorplans/Floor_2/0/0/0.png", 'rb').read()

#cursor.execute("INSERT INTO floorplans(floorId, img) VALUES(%s, %s)", (0, psycopg2.Binary(imgData)))
#conn.commit()

#cursor.execute("SELECT * FROM floorplans")
#curImg = cursor.fetchone()[1]
#open("./Floorplans/floor1.png", "wb").write(curImg)


cursor.close()
conn.close()