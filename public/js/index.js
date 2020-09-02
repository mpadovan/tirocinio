var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    videoready: false,
    videoerror: false,
    data: {
      id: null,
      masc: null,
      weight: null,
      time: null
    },
    videocalc: 0,
    dataj: null,
    video: null
  },
  methods: {
    playvideo: (video) => {
      this.videoready = true;
    },
    startvideo: () => {
      if (this.videoready) {
        var el = document.getElementById('videotest').play();
        el.getAttribute('data-id');
      } else {
        this.videoerror = true;
      }
    }
  },
  mounted() {
    window.addEventListener('keydown', (event) => {
      if (event.keyCode === 32) {
        this.startvideo();
        event.preventDefault();
      }
    });

    axios.get('/videos')
      .then((data) => {
        dataj = data.data;
        this.video = `http://localhost:3000/videoraw/${dataj.videos[this.videocalc]}`;
      })
  }
})

