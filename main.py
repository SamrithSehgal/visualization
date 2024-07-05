from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import random
import psycopg2
import time

driver = webdriver.Chrome()

conn = psycopg2.connect(dbname="visualization", user="postgres", password="samrith123")
cursor = conn.cursor()

buildings = ["DBH", "Ashwins House", "Heaven", "Library", "Hell", "ICS_Lab", "Newtons_Lab", "Harvard", "Uk_Parliment", "White_House"]
days = ["2024-06-27", "2024-06-28", "2024-06-29", "2024-06-30", "2024-07-01"]


sleepTime = 0.3
floorId = 0
locationId = 0
driver.get(f'https://numbergenerator.org/randomnumbergenerator#!numbers=2&low=250&high=100000&unique=true&csv=&oddeven=&oddqty=0&sorted=false&addfilters=sum_of_numbers-val-10000')


numFloors = []
floorIds = []
numRooms = []

for n in range(len(buildings)):
    cursor.execute("INSERT INTO buildings(buildingname) VALUES ('%s');" % (buildings[n]))
    curFloors = random.randint(2, 5)
    numFloors.append(curFloors)
    curRoom = []
    curIds = []

    for o in range(curFloors):
        floorId += 1
        curIds.append(floorId)
        cursor.execute("INSERT INTO floors(building, floornum, floorname) VALUES(%s, %s, 'Floor %s');", (n+1, o+1, o+1))
        floorRooms = random.randint(3, 9)
        curRoom.append(floorRooms)

    numRooms.append(curRoom)
    floorIds.append(curIds)

for h in range(len(days)):
    for i in range(len(buildings)):
        for x in range(numFloors[i]):
            occupancy = random.randint(5000, 9000)

            numsElement = driver.find_element(By.ID, "numbers")
            lowElement = driver.find_element(By.ID, "low")

            lowElement.clear()
            lowElement.send_keys("555")

            numsElement.clear()
            numsElement.send_keys(str(numRooms[i][x]))

            driver.find_element(By.XPATH, "/html/body/div[1]/div/div[1]/div[2]/div/div[1]/div[1]/div[2]/div[4]/div/a[2]").click()

            time.sleep(sleepTime)
            floorSumsElement = driver.find_element(By.XPATH, "//*[@id='filters_row_container']/div/textarea")

            floorSumsElement.clear()
            floorSumsElement.send_keys(str(occupancy))
            driver.find_element(By.XPATH, "//*[@id='magicFiltersModal']/div/div/div[4]/button").click()

            time.sleep(sleepTime)

            driver.find_element(By.ID, "go-button").click()        
            time.sleep(sleepTime)
            roomOccs = driver.find_element(By.ID, "resultVal").get_attribute('textContent').split(" ")

            numsElement.clear()
            numsElement.send_keys("24")      
            lowElement.clear()  
            lowElement.send_keys("0")

            for y in range(len(roomOccs)):
                #print(roomOccs[y])
                locationId += 1

                driver.find_element(By.XPATH, "/html/body/div[1]/div/div[1]/div[2]/div/div[1]/div[1]/div[2]/div[4]/div/a[2]").click()

                time.sleep(sleepTime)
                roomsSumsElement = driver.find_element(By.XPATH, "//*[@id='filters_row_container']/div/textarea")

                roomsSumsElement.clear()
                roomsSumsElement.send_keys(roomOccs[y])
                driver.find_element(By.XPATH, "//*[@id='magicFiltersModal']/div/div/div[4]/button").click()

                time.sleep(sleepTime)

                driver.find_element(By.ID, "go-button").click()     
                time.sleep(sleepTime)   
                data = driver.find_element(By.ID, "resultVal").get_attribute('textContent').split(" ")
                #print("Time Occs: " + str(data))
                print("{\n   Total Occ: " + str(occupancy) + ",\n   Num Floors: " + str(numFloors[i]) + ",\n   Num Rooms: " + str(numRooms[i][x]) + ",\n   INFO:")
                print("     { Day: " + str(days[h]) +", Building Number: " + (str(i+1)) + ", Floor Number: " + (str(x+1)) + ", Floor Id: " + str(floorIds[i][x]) + ", Room Number: " + (str(y+1)) + " }")
                print("\n}\n")
                
                for z in range(len(data)):
                    curTime = f'{days[h]} {z}:00:00'
                    curOcc = int(data[z])
                    cursor.execute("INSERT INTO occupancy_table(location, floor, timestamp, occupancy) VALUES(%s, %s, %s, %s);", (locationId, floorIds[i][x], curTime, curOcc))

            

conn.commit()
cursor.close()
conn.close()
