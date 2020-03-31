var demoInfo =  d3.select("#sample-metadata"); 

function filterData(data, input)
{
for (var i = 0; i < data.length; i++)
{
  var dataNum = parseInt(data[i].id)
  if (dataNum == parseInt(input))
  {
  return data[i];
  }
}
}

function getdata()
{

d3.json("samples.json").then((data) => 
{

 var dropdown = d3.select("#selDataset").selectAll("select");
    dropdown.data(data.names)
    .enter()
    .append("option")
    .html(function(d)
    {
      return `<option value = "${d}">${d}</option>`
    });

    var currentID = d3.select("#selDataset").node().value
    optionChanged(currentID)
  });

};

function optionChanged(input)
{

  d3.json("samples.json").then((data) => {
    

      var dataDict = {}
      topTenOTUIDs = []
      topTenOTUValues = []

      var metadataPlotData = filterData(data.metadata, input);

 
      var samplesPlotData = filterData(data.samples, input);

      demoInfo.html("")

        pLine = demoInfo.append("p");
        pLine.append('p').text(`id: ${metadataPlotData.id}`);
        pLine.append('p').text(`ethnicity: ${metadataPlotData.ethnicity}`);
        pLine.append('p').text(`gender: ${metadataPlotData.gender}`);
        pLine.append('p').text(`age: ${metadataPlotData.age}`);
        pLine.append('p').text(`location: ${metadataPlotData.location}`);
        pLine.append('p').text(`bbtype: ${metadataPlotData.bbtype}`);
        pLine.append('p').text(`wfreq: ${metadataPlotData.wfreq}`);


        for (var i = 0; i < samplesPlotData.otu_ids.length; i++)
        {
            dataDict[`OTU ${samplesPlotData.otu_ids[i]}`] = samplesPlotData.sample_values[i];
              
        }
  
        var items = Object.keys(dataDict).map(function(key) {
          return [key, dataDict[key]];
        });
    
        items.sort(function(first, second) {
          return second[1] - first[1];
        });

        topTenOTU = items.slice(0, 10);cd 


        for (var i = 0; i < topTenOTU.length; i++)
        {
          topTenOTUIDs.push(topTenOTU[i][0])
          topTenOTUValues.push(topTenOTU[i][1])
        }

      var trace1 = 
      {
        x: samplesPlotData.otu_ids,
        y: samplesPlotData.sample_values,
        text: samplesPlotData.otu_labels,
        mode: 'markers',
        marker: {
          size: samplesPlotData.sample_values,
          color: samplesPlotData.otu_ids 
        }
      };


      var data1 = [trace1];

      var layout1= 
      {
        xaxis: { title: "OTU ID" }
      };

      var trace2 =
      {
        type: 'bar',
        x: topTenOTUValues,
        y: topTenOTUIDs,
        orientation: 'h'

      }
      
      var data2 = [trace2];

      var layout2= 
      {
        yaxis: { showticklabels: true},
        hovertext: samplesPlotData.otu_labels,
        maxdisplayed:10
      };

      var trace3 =
      {
        
          domain: { x: [0, 1], y: [0, 1] },
          value: metadataPlotData.wfreq,
          title: { text: "washes" },
          type: "indicator",
          mode: "gauge+number",
          gauge:
          {
            axis: { range:[null,9]}

          }
        
      };
      var data3 = [trace3];


      Plotly.newPlot("bubble", data1, layout1);
      Plotly.newPlot("bar",data2, layout2);
      Plotly.newPlot("gauge",data3);

})};

getdata()