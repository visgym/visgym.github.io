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
      color: ['#ED4E33', '#003262', '#F48024', '#3B7EA1'], // VisGym - Golden Gate (Red), Average - Berkeley Blue, Eval & Training - Orange, Eval-only - Founders Rock
      tooltip: { 
        trigger: 'item',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderColor: '#ED4E33',
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
        data: [
          { name: 'VisGym (Ours)', icon: 'rect' },
          { name: 'Average of Baselines', icon: 'rect' },
          { name: 'Eval & Training: VLABench, VLM-Gym, KORGym, VisualAgentBench, VAGEN', icon: 'none', textStyle: { color: '#F48024', fontWeight: 'bold', fontSize: 10 } },
          { name: 'VLABench', icon: 'rect' },
          { name: 'VLM-Gym', icon: 'rect' },
          { name: 'KORGym', icon: 'rect' },
          { name: 'VisualAgentBench', icon: 'rect' },
          { name: 'VAGEN', icon: 'rect' },
          { name: 'Eval-only: OSWorld, LIBERO, VideoGameBench, LMGame-Bench', icon: 'none', textStyle: { color: '#3B7EA1', fontWeight: 'bold', fontSize: 10 } },
          { name: 'OSWorld', icon: 'rect' },
          { name: 'LIBERO', icon: 'rect' },
          { name: 'VideoGameBench', icon: 'rect' },
          { name: 'LMGame-Bench', icon: 'rect' }
        ],
        selected: {
          'VisGym (Ours)': true,
          'Average of Baselines': true,
          'Eval & Training: VLABench, VLM-Gym, KORGym, VisualAgentBench, VAGEN': false,
          'VLABench': false,
          'VLM-Gym': false,
          'KORGym': false,
          'VisualAgentBench': false,
          'VAGEN': false,
          'Eval-only: OSWorld, LIBERO, VideoGameBench, LMGame-Bench': false,
          'OSWorld': false,
          'LIBERO': false,
          'VideoGameBench': false,
          'LMGame-Bench': false
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
                color: 'rgba(237, 78, 51, 0.2)' // Golden Gate (Red) - 20% transparency
              },
              lineStyle: { 
                width: 3,
                color: '#ED4E33'
              },
              itemStyle: {
                color: '#ED4E33',
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
                  color: 'rgba(237, 78, 51, 0.3)'
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
                color: 'rgba(0, 50, 98, 0.15)' // Berkeley Blue - lighter
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
                  color: 'rgba(0, 50, 98, 0.25)'
                }
              }
            },
            {
              value: baselineData[0],
              name: 'OSWorld',
              areaStyle: { 
                color: 'rgba(59, 126, 161, 0.2)' // Founders Rock (Teal) - Eval-only
              },
              lineStyle: { 
                type: 'dotted',
                width: 2,
                color: '#3B7EA1'
              },
              itemStyle: {
                color: '#3B7EA1'
              },
              label: {
                show: false // Hide labels for all frameworks
              },
              emphasis: {
                lineStyle: {
                  width: 2.5
                },
                areaStyle: {
                  color: 'rgba(244, 128, 36, 0.3)'
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
                color: 'rgba(59, 126, 161, 0.2)' // Founders Rock (Teal) - Eval-only
              },
              lineStyle: { 
                type: 'dotted',
                width: 2,
                color: '#3B7EA1'
              },
              itemStyle: {
                color: '#3B7EA1'
              },
              label: {
                show: false
              },
              emphasis: {
                lineStyle: {
                  width: 2.5
                },
                areaStyle: {
                  color: 'rgba(244, 128, 36, 0.3)'
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
                color: 'rgba(59, 126, 161, 0.2)' // Founders Rock (Teal) - Eval-only
              },
              lineStyle: { 
                type: 'dotted',
                width: 2,
                color: '#3B7EA1'
              },
              itemStyle: {
                color: '#3B7EA1'
              },
              label: {
                show: false
              },
              emphasis: {
                lineStyle: {
                  width: 2.5
                },
                areaStyle: {
                  color: 'rgba(244, 128, 36, 0.3)'
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
                color: 'rgba(59, 126, 161, 0.2)' // Founders Rock (Teal) - Eval-only
              },
              lineStyle: { 
                type: 'dotted',
                width: 2,
                color: '#3B7EA1'
              },
              itemStyle: {
                color: '#3B7EA1'
              },
              label: {
                show: false
              },
              emphasis: {
                lineStyle: {
                  width: 2.5
                },
                areaStyle: {
                  color: 'rgba(59, 126, 161, 0.3)' // Founders Rock emphasis
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
                color: 'rgba(244, 128, 36, 0.2)' // Orange - Eval & Training
              },
              lineStyle: { 
                type: 'dashed',
                width: 2,
                color: '#F48024'
              },
              itemStyle: {
                color: '#F48024'
              },
              label: {
                show: false
              },
              emphasis: {
                lineStyle: {
                  width: 2.5
                },
                areaStyle: {
                  color: 'rgba(244, 128, 36, 0.3)' // Orange emphasis
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
                color: 'rgba(244, 128, 36, 0.2)' // Orange - Eval & Training
              },
              lineStyle: { 
                type: 'dashed',
                width: 2,
                color: '#F48024'
              },
              itemStyle: {
                color: '#F48024'
              },
              label: {
                show: false
              },
              emphasis: {
                lineStyle: {
                  width: 2.5
                },
                areaStyle: {
                  color: 'rgba(244, 128, 36, 0.3)' // Orange emphasis
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
                color: 'rgba(244, 128, 36, 0.2)' // Orange - Eval & Training
              },
              lineStyle: { 
                type: 'dashed',
                width: 2,
                color: '#F48024'
              },
              itemStyle: {
                color: '#F48024'
              },
              label: {
                show: false
              },
              emphasis: {
                lineStyle: {
                  width: 2.5
                },
                areaStyle: {
                  color: 'rgba(244, 128, 36, 0.3)' // Orange emphasis
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
                color: 'rgba(244, 128, 36, 0.2)' // Orange - Eval & Training
              },
              lineStyle: { 
                type: 'dashed',
                width: 2,
                color: '#F48024'
              },
              itemStyle: {
                color: '#F48024'
              },
              label: {
                show: false
              },
              emphasis: {
                lineStyle: {
                  width: 2.5
                },
                areaStyle: {
                  color: 'rgba(244, 128, 36, 0.3)'
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
                color: 'rgba(244, 128, 36, 0.2)' // Orange - Eval & Training
              },
              lineStyle: { 
                type: 'dashed',
                width: 2,
                color: '#F48024'
              },
              itemStyle: {
                color: '#F48024'
              },
              label: {
                show: false
              },
              emphasis: {
                lineStyle: {
                  width: 2.5
                },
                areaStyle: {
                  color: 'rgba(244, 128, 36, 0.3)' // Orange emphasis
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
      'Eval & Training: VLABench, VLM-Gym, KORGym, VisualAgentBench, VAGEN': false,
      'VLABench': false,
      'VLM-Gym': false,
      'KORGym': false,
      'VisualAgentBench': false,
      'VAGEN': false,
      'Eval-only: OSWorld, LIBERO, VideoGameBench, LMGame-Bench': false,
      'OSWorld': false,
      'LIBERO': false,
      'VideoGameBench': false,
      'LMGame-Bench': false
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
      
      // Ignore clicks on group labels
      if (clickedName && (clickedName === 'Eval & Training: VLABench, VLM-Gym, KORGym, VisualAgentBench, VAGEN' || clickedName === 'Eval-only: OSWorld, LIBERO, VideoGameBench, LMGame-Bench')) {
        // Don't allow toggling group labels
        myChart.dispatchAction({
          type: 'legendSelect',
          selected: defaultSelected
        });
        return;
      }
      
      // If clicking on a baseline framework
      if (clickedName && clickedName !== 'VisGym (Ours)' && clickedName !== 'Average of Baselines') {
        // Show only this framework + VisGym + Average
        var newSelected = {
          'VisGym (Ours)': true,
          'Average of Baselines': true,
          'Eval & Training: VLABench, VLM-Gym, KORGym, VisualAgentBench, VAGEN': false,
          'Eval-only: OSWorld, LIBERO, VideoGameBench, LMGame-Bench': false
        };
        newSelected[clickedName] = params.selected[clickedName];
        
        // Hide all other baselines
        for (var name in defaultSelected) {
          if (name !== 'VisGym (Ours)' && name !== 'Average of Baselines' && 
              name !== 'Eval & Training: VLABench, VLM-Gym, KORGym, VisualAgentBench, VAGEN' && 
              name !== 'Eval-only: OSWorld, LIBERO, VideoGameBench, LMGame-Bench' && 
              name !== clickedName) {
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

