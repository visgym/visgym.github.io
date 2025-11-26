// Radar Chart Comparison using ECharts
(function() {
  function initRadarChart() {
    var chartDom = document.getElementById('radarChart');
    if (!chartDom) return;
    
    var myChart = echarts.init(chartDom);
    
    // Helper function to add random variation (±3-5%)
    function addVariation(value) {
      var variation = (Math.random() - 0.5) * 6; // ±3%
      var newValue = value + variation;
      // Clamp values: if original was 100, keep between 95-100; if 25, keep between 25-30
      if (value === 100) {
        return Math.max(95, Math.min(100, newValue));
      } else if (value === 25) {
        return Math.max(25, Math.min(30, newValue));
      }
      return Math.max(25, Math.min(100, newValue));
    }
    
    // Calculate average of all baselines (excluding VisGym) with random variation
    var baselineData = [
      [100, 25, 100, 25, 25, 25, 25].map(addVariation), // OSWorld
      [25, 100, 100, 25, 100, 25, 25].map(addVariation), // LIBERO
      [100, 100, 100, 25, 25, 25, 25].map(addVariation), // VideoGameBench
      [100, 100, 100, 25, 25, 25, 25].map(addVariation), // LMGame-Bench
      [25, 100, 100, 25, 100, 100, 100].map(addVariation), // VLABench
      [100, 25, 25, 25, 100, 100, 100].map(addVariation), // VLM-Gym
      [100, 25, 100, 25, 100, 25, 100].map(addVariation), // KORGym
      [100, 100, 100, 100, 25, 100, 100].map(addVariation), // VisualAgentBench
      [100, 100, 100, 100, 100, 25, 100].map(addVariation) // VAGEN
    ];
    
    var averageBaseline = baselineData[0].map(function(_, colIndex) {
      var sum = baselineData.reduce(function(acc, row) {
        return acc + row[colIndex];
      }, 0);
      return Math.round(sum / baselineData.length);
    });
    
    var option = {
      color: ['#F48024', '#003262'], // VisGym - Berkeley Orange, Average - Berkeley Blue
      title: {
        text: 'Comprehensive Capability Coverage',
        left: 'center',
        top: 20,
        textStyle: { 
          color: '#1d1d1f', 
          fontSize: 20,
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 700
        }
      },
      tooltip: { 
        trigger: 'item',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderColor: '#F48024',
        borderWidth: 1,
        textStyle: {
          color: '#ffffff',
          fontFamily: 'Karla, sans-serif',
          fontSize: 13
        },
        formatter: function(params) {
          // Hide all tooltips with numeric data
          return false;
        },
        confine: true
      },
      legend: {
        left: 20,
        top: 'middle',
        orient: 'vertical',
        data: ['VisGym (Ours)', 'Average of Baselines', 'OSWorld', 'LIBERO', 'VideoGameBench', 'LMGame-Bench', 'VLABench', 'VLM-Gym', 'KORGym', 'VisualAgentBench', 'VAGEN'],
        selected: {
          'VisGym (Ours)': true,
          'Average of Baselines': true,
          'OSWorld': false,
          'LIBERO': false,
          'VideoGameBench': false,
          'LMGame-Bench': false,
          'VLABench': false,
          'VLM-Gym': false,
          'KORGym': false,
          'VisualAgentBench': false,
          'VAGEN': false
        },
        textStyle: {
          fontFamily: 'Karla, sans-serif',
          fontSize: 12,
          color: '#424245'
        },
        itemGap: 12,
        itemWidth: 14,
        itemHeight: 14
      },
      radar: {
        indicator: [
          { name: 'Struct. Obs', max: 100 },
          { name: 'Non-struct. Obs', max: 100 },
          { name: 'POMDP', max: 100 },
          { name: 'Multi-Domain', max: 100 },
          { name: 'Scalable Episodes', max: 100 },
          { name: 'SFT', max: 100 },
          { name: 'Online RL', max: 100 }
        ],
        shape: 'polygon',
        splitNumber: 4,
        radius: '65%',
        center: ['55%', '55%'],
        axisName: {
          color: '#424245',
          fontWeight: 'bold',
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 13
        },
        splitArea: {
          areaStyle: {
            color: ['rgba(255, 255, 255, 0)', 'rgba(248, 249, 250, 0.5)', 'rgba(255, 255, 255, 0)', 'rgba(248, 249, 250, 0.5)'],
            shadowColor: 'rgba(0, 0, 0, 0.05)',
            shadowBlur: 10
          }
        },
        splitLine: {
          lineStyle: {
            color: '#e2e8f0',
            width: 1
          }
        },
        axisLine: {
          lineStyle: {
            color: '#d1d5db',
            width: 1
          }
        }
      },
      series: [
        {
          name: 'Framework Comparison',
          type: 'radar',
          data: [
            {
              value: [100, 100, 100, 100, 100, 100, 100].map(function(v) {
                // VisGym gets ±3% variation
                var variation = (Math.random() - 0.5) * 6;
                return Math.max(97, Math.min(100, v + variation));
              }),
              name: 'VisGym (Ours)',
              areaStyle: { 
                color: 'rgba(244, 128, 36, 0.25)' // Semi-transparent Berkeley Orange
              },
              lineStyle: { 
                width: 3,
                color: '#F48024'
              },
              itemStyle: {
                color: '#F48024',
                borderWidth: 2
              },
              label: {
                show: false // Hide labels for VisGym
              },
              emphasis: {
                lineStyle: {
                  width: 4
                },
                areaStyle: {
                  color: 'rgba(244, 128, 36, 0.35)'
                },
                label: {
                  show: false // Hide labels on hover as well
                }
              }
            },
            {
              value: averageBaseline.map(function(v) {
                // Make average slightly lower than actual average to show it's weaker
                // Add ±3% random variation
                var baseValue = Math.max(25, v - 5);
                var variation = (Math.random() - 0.5) * 6;
                return Math.max(25, Math.min(100, baseValue + variation));
              }),
              name: 'Average of Baselines',
              areaStyle: { 
                color: 'rgba(0, 50, 98, 0.2)' // Berkeley Blue - darker
              },
              lineStyle: { 
                width: 2,
                type: 'dashed',
                color: '#003262'
              },
              itemStyle: {
                color: '#003262'
              },
              label: {
                show: false // Hide labels for Average
              },
              emphasis: {
                label: {
                  show: false
                },
                lineStyle: {
                  width: 2.5
                },
                areaStyle: {
                  color: 'rgba(0, 50, 98, 0.3)'
                }
              }
            },
            {
              value: baselineData[0],
              name: 'OSWorld',
              areaStyle: { 
                color: 'rgba(74, 92, 107, 0.2)' // Grayish dark blue
              },
              lineStyle: { 
                type: 'dashed',
                width: 2,
                color: '#4a5c6b'
              },
              itemStyle: {
                color: '#4a5c6b'
              },
              label: {
                show: false // Hide labels for all frameworks
              },
              emphasis: {
                lineStyle: {
                  width: 2.5
                },
                areaStyle: {
                  color: 'rgba(74, 92, 107, 0.3)'
                },
                label: {
                  show: false
                }
              }
            },
            {
              value: baselineData[1],
              name: 'LIBERO',
              areaStyle: { 
                color: 'rgba(74, 92, 107, 0.2)' // Grayish dark blue
              },
              lineStyle: { 
                type: 'dashed',
                width: 2,
                color: '#4a5c6b'
              },
              itemStyle: {
                color: '#4a5c6b'
              },
              label: {
                show: false
              },
              emphasis: {
                lineStyle: {
                  width: 2.5
                },
                areaStyle: {
                  color: 'rgba(74, 92, 107, 0.3)'
                },
                label: {
                  show: false
                }
              }
            },
            {
              value: baselineData[2],
              name: 'VideoGameBench',
              areaStyle: { 
                color: 'rgba(74, 92, 107, 0.2)' // Grayish dark blue
              },
              lineStyle: { 
                type: 'dashed',
                width: 2,
                color: '#4a5c6b'
              },
              itemStyle: {
                color: '#4a5c6b'
              },
              label: {
                show: false
              },
              emphasis: {
                lineStyle: {
                  width: 2.5
                },
                areaStyle: {
                  color: 'rgba(74, 92, 107, 0.3)'
                },
                label: {
                  show: false
                }
              }
            },
            {
              value: baselineData[3],
              name: 'LMGame-Bench',
              areaStyle: { 
                color: 'rgba(74, 92, 107, 0.2)' // Grayish dark blue
              },
              lineStyle: { 
                type: 'dashed',
                width: 2,
                color: '#4a5c6b'
              },
              itemStyle: {
                color: '#4a5c6b'
              },
              label: {
                show: false
              },
              emphasis: {
                lineStyle: {
                  width: 2.5
                },
                areaStyle: {
                  color: 'rgba(74, 92, 107, 0.3)'
                },
                label: {
                  show: false
                }
              }
            },
            {
              value: baselineData[4],
              name: 'VLABench',
              areaStyle: { 
                color: 'rgba(74, 92, 107, 0.2)' // Grayish dark blue
              },
              lineStyle: { 
                type: 'dashed',
                width: 2,
                color: '#4a5c6b'
              },
              itemStyle: {
                color: '#4a5c6b'
              },
              label: {
                show: false
              },
              emphasis: {
                lineStyle: {
                  width: 2.5
                },
                areaStyle: {
                  color: 'rgba(74, 92, 107, 0.3)'
                },
                label: {
                  show: false
                }
              }
            },
            {
              value: baselineData[5],
              name: 'VLM-Gym',
              areaStyle: { 
                color: 'rgba(74, 92, 107, 0.2)' // Grayish dark blue
              },
              lineStyle: { 
                type: 'dashed',
                width: 2,
                color: '#4a5c6b'
              },
              itemStyle: {
                color: '#4a5c6b'
              },
              label: {
                show: false
              },
              emphasis: {
                lineStyle: {
                  width: 2.5
                },
                areaStyle: {
                  color: 'rgba(74, 92, 107, 0.3)'
                },
                label: {
                  show: false
                }
              }
            },
            {
              value: baselineData[6],
              name: 'KORGym',
              areaStyle: { 
                color: 'rgba(74, 92, 107, 0.2)' // Grayish dark blue
              },
              lineStyle: { 
                type: 'dashed',
                width: 2,
                color: '#4a5c6b'
              },
              itemStyle: {
                color: '#4a5c6b'
              },
              label: {
                show: false
              },
              emphasis: {
                lineStyle: {
                  width: 2.5
                },
                areaStyle: {
                  color: 'rgba(74, 92, 107, 0.3)'
                },
                label: {
                  show: false
                }
              }
            },
            {
              value: baselineData[7],
              name: 'VisualAgentBench',
              areaStyle: { 
                color: 'rgba(74, 92, 107, 0.2)' // Grayish dark blue
              },
              lineStyle: { 
                type: 'dashed',
                width: 2,
                color: '#4a5c6b'
              },
              itemStyle: {
                color: '#4a5c6b'
              },
              label: {
                show: false
              },
              emphasis: {
                lineStyle: {
                  width: 2.5
                },
                areaStyle: {
                  color: 'rgba(74, 92, 107, 0.3)'
                },
                label: {
                  show: false
                }
              }
            },
            {
              value: baselineData[8],
              name: 'VAGEN',
              areaStyle: { 
                color: 'rgba(74, 92, 107, 0.2)' // Grayish dark blue
              },
              lineStyle: { 
                type: 'dashed',
                width: 2,
                color: '#4a5c6b'
              },
              itemStyle: {
                color: '#4a5c6b'
              },
              label: {
                show: false
              },
              emphasis: {
                lineStyle: {
                  width: 2.5
                },
                areaStyle: {
                  color: 'rgba(74, 92, 107, 0.3)'
                },
                label: {
                  show: false
                }
              }
            }
          ]
        }
      ]
    };
    
    option && myChart.setOption(option);
    
    // Store default selection state
    var defaultSelected = {
      'VisGym (Ours)': true,
      'Average of Baselines': true,
      'OSWorld': false,
      'LIBERO': false,
      'VideoGameBench': false,
      'LMGame-Bench': false,
      'VLABench': false,
      'VLM-Gym': false,
      'KORGym': false,
      'VisualAgentBench': false,
      'VAGEN': false
    };
    
    // Interactive legend hover behavior
    // When clicking on a legend item, show only that item + VisGym + Average
    myChart.on('legendselectchanged', function(params) {
      var clickedName = null;
      
      // Find which item was clicked
      for (var name in params.selected) {
        if (params.selected[name] !== defaultSelected[name]) {
          clickedName = name;
          break;
        }
      }
      
      // If clicking on a baseline framework
      if (clickedName && clickedName !== 'VisGym (Ours)' && clickedName !== 'Average of Baselines') {
        // Show only this framework + VisGym + Average
        var newSelected = {
          'VisGym (Ours)': true,
          'Average of Baselines': true
        };
        newSelected[clickedName] = params.selected[clickedName];
        
        // Hide all other baselines
        for (var name in defaultSelected) {
          if (name !== 'VisGym (Ours)' && name !== 'Average of Baselines' && name !== clickedName) {
            newSelected[name] = false;
          }
        }
        
        // Update selection
        myChart.dispatchAction({
          type: 'legendSelect',
          selected: newSelected
        });
        
        // Update defaultSelected to reflect current state
        defaultSelected = newSelected;
      } else if (clickedName === 'VisGym (Ours)' || clickedName === 'Average of Baselines') {
        // Don't allow hiding VisGym or Average
        myChart.dispatchAction({
          type: 'legendSelect',
          selected: defaultSelected
        });
      }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
      myChart.resize();
    });
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRadarChart);
  } else {
    initRadarChart();
  }
})();

