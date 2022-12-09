LOAD_TO = 100

def generate(request):
    response = {}
    results = []
    response['start'] = request['start']
    response['end'] = request['start'] + request['load']
    for i in range(request['start'], request['start'] + request['load']):
        if (i > LOAD_TO - 1):
            response['end'] = i;
            break
        response[str(i)] = {"result" : str(i + 1) + '. Result', "data" : str(100 - i) + "%"}

    print(response)                            
    return response