// 2 player max, 10 round max
const PLAYERS = 2;
const ROUNDS = 10;

const App = {
  data() {
    return {
      players: [],
      rn: 0,
      round_view: true,
      scoreboard_view: true,
    }
  },
  methods: {
    nextRound() {
      this.rn = Math.min(this.rn+1, 9); // 9 not 10, zero indexed
    },
    prevRound() {
      this.rn = Math.max(0, this.rn-1);
    },
    calculateScore(rn, r) {
      if (r.bet < 0) {
          return 0;
      } // no bet yet

      if (r.bet == 0) {
        if (r.act == 0) {
          return (rn+1)*10;
        }
        return -(rn+1)*10;
      }

      if (r.bet == r.act) {
        return r.bet*20 + r.pirates*30 + r.skulls*50;
      }
      return -Math.abs(r.bet-r.act)*10;
    },
    totalScore(player) {
      let total = 0;
      player.rounds.forEach((round, rn) => {
        total += this.calculateScore(rn, round);
      });
      return total;
    },
    toggleRoundView() {
      this.round_view = !this.round_view;
    },
    toggleScoreboardView() {
      this.scoreboard_view = !this.scoreboard_view;
    },
    increment(rn, n) {
      return Math.max(rn, n+1);
    },
    increment(rn, n) {
      return Math.max(rn, n+1);
    },
    saveState(k, v) {
      s = JSON.stringify(v);
      // console.log(`saving ${k} ${s} to localStorage`);
      localStorage.setItem(k, s);
      // console.log(`saved ${k} ${s} to localStorage`);
    },
    addPlayer() {
      let alphabet = ["a","b","c","d","e","f","g", "h", "i", "j", "k"]; // lazy defaults
      player = {
        name: `${alphabet[this.players.length]}`,
        rounds: [],
      };
      for (let r = 0; r < ROUNDS; ++r) {
        player.rounds.push({
          bet: -1,
          act: 0,
          pirates: 0,
          skulls: 0,
        });
      }
      this.players.push(player);
    },
    wipePlayers() {
      // generate from scratch
      this.players = [];
      for (let p = 0; p < PLAYERS; p++) {
        this.addPlayer();
      }
    },
    confirmWipePlayers() {
      if (confirm("Really wipe the game state?")) {
        this.wipePlayers();
      }
    },
  },
  mounted() {
    if (localStorage.getItem("players")) {
      // console.log(`restoring players from localStorage`);
      s = localStorage.getItem("players");
      // console.log(`restoring players ${s} to localStorage`);
      this.players = JSON.parse(s);
      if (this.players.len <= 2) {
        // consider it to be corrupt
        console.log("weird local storage {s}, wiping");
        this.wipePlayers();
      }
      return;
    }

    this.wipePlayers();
  },
  watch: {
    players: {
      handler(v, _) {
        this.saveState("players", v)
      },
      deep: true,
    },
  },
};

Vue.createApp(App).mount("#app");
