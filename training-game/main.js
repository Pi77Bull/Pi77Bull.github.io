Promise.all([/* fetch('initial.json'), fetch('current.json'), fetch('daysInFaction.json'),  */fetch('data.json')])
  .then(async ([/* a, b, c,  */d]) => [/* await a.json(), await b.json(), await c.json(),  */await d.json()])
  .then(([/* initial, current, daysInFaction,  */data]) => {

    /*     getDivision = (id) => {
          const days = daysInFaction[id];
          return [2063712, 1546123, 1338715, 1042858, 465258, 103624, 90036].includes(+id) ? 0
            : days >= 1239 ? 1
              : days >= 730 ? 2
                : days >= 1 ? 3
                  : null;
        }
    
        const members = Object.entries(current)
          .filter(player => !player[1].exMember)
          .map(player => ({
            id: player[0],
            division: getDivision(player[0]),
            name: player[1].name,
            gain: ((player[1].strength || 0) - (initial[player[0]]?.strength || 0)) +
              ((player[1].defense || 0) - (initial[player[0]]?.defense || 0)) +
              ((player[1].speed || 0) - (initial[player[0]]?.speed || 0)) +
              ((player[1].dexterity || 0) - (initial[player[0]]?.dexterity || 0))
          })); */

    const members = data;

    members.sort((a, b) => b.gain - a.gain);
    let visiblePlayers = members.slice(0);

    const divisions = [
      { color: '#A0A000', label: `Division 1 (Drug Free)` },
      { color: '#ff0000', label: `Division 2 (${1239} DiF)` },
      { color: '#00ff00', label: `Division 3 (${730} DiF)` },
      { color: '#0000ff', label: `Division 4 - 1 DiF` }
    ];

    divisions.forEach((d, i) => {
      let item = document.createElement('div');
      item.innerHTML = `<div class="color" style="background-color: ${d.color}80;"></div><div class="name">${d.label}</div>`;
      item.addEventListener('click', () => {
        item.classList.toggle('disabled');
        const visibleDivisions = [...document.querySelectorAll('#legend>div')].map(e => !e.classList.contains('disabled'));
        visiblePlayers = members.filter(player => visibleDivisions[player.division]);
        chart.data.datasets[0].data = visiblePlayers.map(player => player.gain);
        chart.data.labels = visiblePlayers.map(player => player.name);
        chart.update();
      });
      document.querySelector('#legend').appendChild(item);
    });

    colorize = (opaque, ctx) => {
      const division = visiblePlayers[ctx.index]?.division;
      const color = divisions[division]?.color || '#000000';

      return opaque ? color : color.concat('80');
    }

    const chart = new Chart('myChart', {
      type: 'bar',
      data: {
        datasets: [
          {
            data: visiblePlayers.map(player => ({ x: player.name, y: player.gain }))
          }
        ]
      },
      options: {
        scales: {
          x: {
            ticks: {
              autoSkip: false
            }
          },
          y: {
            ticks: {
              beginAtZero: true
            }
          }
        },
        animation: false,
        plugins: {
          legend: false
        },
        elements: {
          bar: {
            backgroundColor: colorize.bind(null, false),
          }
        }
      }
    });
  });
