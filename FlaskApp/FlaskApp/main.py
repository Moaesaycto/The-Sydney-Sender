from ctypes import sizeof
import json
from lib2to3.pytree import generate_matches

LOAD_TO = 100

DIST_RATE = 30
SOCI_RATE = 10
PHYS_RATE = 20
PRIC_RATE = 10
HUNG_RATE = 10
PTRA_RATE = 10
PRKG_RATE = 10
ALCH_RATE = 30
TODA_RATE = 30
STRG_RATE = 10
BOOK_RATE = 5

TIME_OPTS = ["morning", "daytime", "night"]

def generate(request):
    response = {}
    results = []

    main_list = create_list(request)
    response['start'] = request['start']
    response['end'] = request['start'] + request['load']
    for i in range(request['start'], request['start'] + request['load']):
        if (i > LOAD_TO - 1):
            response['end'] = i;
            break
        response[str(i)] = {"result" : str(i + 1) + '. ' + main_list[i]['name'], "data" : str(round(main_list[i]["rating"],2)) + "%"}                        
    return response


def generate_rating(dict, inputs):
    total = 0

    total += DIST_RATE * ((9 - abs(dict["range"]) - inputs["range"]))/9

    total += SOCI_RATE * (9 - abs(dict["social"] - inputs["social"]))/9

    total += PHYS_RATE * (9 - abs(dict["physical"] - inputs["physical"]))/9

    total += PRIC_RATE * (9 - abs(dict["money"] - inputs["money"]))/9

    if dict["food"] == inputs["food"]: total += HUNG_RATE

    if "public" in dict["transport"] and "public" in inputs["transport"]: total += PTRA_RATE
    elif "public" not in dict["transport"] and "public" not in inputs["transport"]: total += PTRA_RATE
    if "driving" in dict["transport"] and "driving" in inputs["transport"]: total += PRKG_RATE
    elif "driving" not in dict["transport"] and "driving" not in inputs["transport"]: total += PRKG_RATE

    if dict["alcohol"] == inputs["alcohol"]: total += ALCH_RATE

    if (inputs["time"] == "anytime" or dict["time"] == "anytime"): total += TODA_RATE
    else: total += TODA_RATE * (3 - abs(TIME_OPTS.index(dict["time"]) - TIME_OPTS.index(inputs["time"])))/3

    total += STRG_RATE * (9 - abs(dict["people"] - inputs["people"]))/9

    if dict["freedom"] == inputs["freedom"]: total += BOOK_RATE

    percentage = total / (DIST_RATE + SOCI_RATE + PHYS_RATE + PRIC_RATE + HUNG_RATE + PTRA_RATE + PRKG_RATE + ALCH_RATE + TODA_RATE + STRG_RATE + BOOK_RATE) * 100

    return percentage


def create_list(request):
    with open('resources/activities.json') as json_file:
        data = json.load(json_file)
        results = [{"name" : key, "rating" : generate_rating(data[key], request)} for key in data.keys()]
        results = clean_unwanted(results, request)
        newlist = sorted(results, key=lambda d: d['rating'])
        newlist.reverse()
    
    return newlist


def clean_unwanted(results, inputs):
    for item in results:
        if "Pub Crawl" in item['name'] and not inputs["alcohol"]:
            item['rating'] = item['rating']/2
        if "Wine Tasting" in item['name'] and not inputs["alcohol"]:
            item['rating'] = item['rating']/2
        if "Go to a Brewery" in item['name'] and not inputs["alcohol"]:
            item['rating'] = item['rating']/2
    
    return results
