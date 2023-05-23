import json

##### TO DO BEFORE PROCESSING TWITTER

class Suburb():
    def __init__(self, bbox, suburb_code, polygon):
        self.id = suburb_code
        self.left = min(bbox[0],bbox[2])
        self.right = max(bbox[0],bbox[2])
        self.top = max(bbox[1],bbox[3])
        self.bottom = min(bbox[1],bbox[3])
        self.centre = [(bbox[0] + bbox[2]) / 2,(bbox[1] + bbox[3]) / 2]
        self.polygon = polygon

# Read the JSON file
with open('testingMAP/Merged-Aus-Polygon_2.geojson', 'r') as f:
    data = json.load(f)

suburbs = []

for obj in data['features']:
    suburb = Suburb(
        obj['properties']['bbox'],
        obj['properties']['geography0'],
        obj['geometry']['coordinates'][0]
    )
    suburbs.append(suburb)

# Ray tracing
def ray_tracing_method(x,y,poly):

    n = len(poly)
    inside = False

    p1x,p1y = poly[0]
    for i in range(n+1):
        p2x,p2y = poly[i % n]
        if y > min(p1y,p2y):
            if y <= max(p1y,p2y):
                if x <= max(p1x,p2x):
                    if p1y != p2y:
                        xints = (y-p1y)*(p2x-p1x)/(p2y-p1y)+p1x
                    if p1x == p2x or x <= xints:
                        inside = not inside
        p1x,p1y = p2x,p2y

    return inside

# DURING TWITTER (embed in twitter processing function):
x_coord = 0# Insert twitter x coord of centre of bbox
y_coord = 0# Insert twitter y coord of centre of bbox

for sub in suburbs:
    # In bounding box
    if x_coord >= sub.left and x_coord <= sub.right and y_coord <= sub.top and y_coord >= sub.bottom:
        # Check if in polygon
        if ray_tracing_method(x_coord,y_coord,sub.polygon):

            print("In suburb:", sub.id)