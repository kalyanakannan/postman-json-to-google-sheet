var data    = new Array();
var data_index = 0;
var headers = [['name', 'url', 'method', 'description']];

function PostmanImport() {
  var jsondata = UrlFetchApp.fetch("https://www.getpostman.com/collections/4728f4d010f781cc3390");
  var object   = JSON.parse(jsondata.getContentText());
  getAPIs(object.item);
  SpreadsheetApp.getActiveSpreadsheet().getRange("A1:D1").setValues(headers);
  SpreadsheetApp.getActiveSpreadsheet().getRange("A2:D"+ (data.length+1).toString()).setValues(data);
}

function getAPIs(items) {
  
  items.forEach(function(item) {
    if(item.item !== undefined) {
      getAPIs(item.item);
    }
    // if(item.item !== undefined){
      
    // }
    response = getAPIData(item);
    if(response.length) {
      var flat_array = new Array();
      headers[0].forEach(function(header) {
        if(Object.keys(response).indexOf(header) == -1) {
          flat_array.push("");
        } else {
          flat_array.push(response[header]);
        }
      });
      data[data_index] = flat_array
      data_index = data_index + 1;
      console.log(data_index);
    }
  });
}

function getAPIData(item) {
  var data    = new Array();
  if(item !== null && item !== undefined && item.request !== undefined){
    data['name'] = item['name'];
    keys = Object.keys(item.request);
    if(data['name'] == 'Create a Account') {
      console.log(keys)
    }
    keys.forEach(function(key){
      if (headers[0].indexOf(key) != -1) {
        if(key == 'url' && item.request[key] !==null) {
          if(item.request[key].raw === undefined) {
            data[key] = item.request[key];
          } else {
            data[key] = item.request[key].raw;
          }
        } else {
          data.push(item.request[key]);
          data[key] = item.request[key];
        }
      }
    });
  }
  if(data.url !== undefined) {
    return data;
  } else {
    return [];
  }
}
