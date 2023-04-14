

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const cd = $('.cd')
const cdWidth = cd.offsetWidth 
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const btnNext = $('.btn-next')
const btnPrev = $('.btn-prev')
const btnRandom = $('.btn-random')
const btnReplay = $('.btn-repeat')
const playList = $('.playlist')



const app = {

    currentIndex : 0,
    isPlaying: false,
    isRandom: false,
    isReplay: false,

    songs : [
        {
      name: "tlinh - nếu lúc đó (ft. 2pillz)",
      singer: "Tlinh",
      path: './assets/music/song1.mp3',
      image: "./assets/image/song1.jpg"
    },
    {
      name: "XTC",
      singer: "mck, trungtran,tlinh",
      path: './assets/music/song2.mp3',
      image: "./assets/image/song2.jpg"
    },

    {
      name: "Em iu",
      singer: "mt",
      path: './assets/music/song3.mp3',
      image: "./assets/image/song3.jpg"
    },
    {
      name: "dont côi",
      singer: "gumie Bear xinh vl",
      path: './assets/music/song4.mp3',
      image: "./assets/image/song4.jpg"
    },
    {
      name: "ghệ iu dấu",
      singer: "Rgumie Bear xinh vl",
      path: './assets/music/song5.mp3',
      image: "./assets/image/song5.jpg"  
    },
    
   
    
    
    
    
    
    
    ],
    

    //render
    render: function(){
        const htmls = this.songs.map((song, a) => {
            return `
            <div class="song ${a === this.currentIndex ? 'active' : ''} " data-index="${a}" >
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>
            `
        })

        playList.innerHTML = htmls.join('')
    },


    //handleEvent

        handleEvent : function(){
          const _this = this


          // xử lý CD quay
          const cdThumbRotate = cdThumb.animate([
            { transform : 'rotate(360deg)' }
          ],{
            duration: 10000,
            iterations: Infinity
          })

          cdThumbRotate.pause()

          // xử lý cd thu nhỏ
            document.onscroll = function(){
                const srollTop = window.scrollY || document.documentElement.scrollTop
                const newCdWidth = cdWidth-srollTop
                cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
                cd.style.opacity = newCdWidth / cdWidth  
            }

            // xử lý nút play
            playBtn.onclick = function(){
              if(app.isPlaying) {
                audio.pause()
              } else {
                audio.play()
              }            
            }


            // khi song đc play
            audio.onplay = function(){
               app.isPlaying= true
               player.classList.add('playing')
               cdThumbRotate.play()

            }

              // khi song đc pause
              audio.onpause = function(){
                 app.isPlaying= false 
                 player.classList.remove('playing')
                 cdThumbRotate.pause()
  
              }

              // xử lý tiến độ bài hát
              audio.ontimeupdate = function() {
                if(audio.duration){
                  const progessPercent = Math.floor((audio.currentTime/audio.duration)*100)
                  progress.value = progessPercent
                }
              } 
              // xử lý khi tua song
              progress.onchange = function(e) {
                 const seekTime = audio.duration / 100 * e.target.value 
                 audio.currentTime = seekTime
              }
              // xử lý bấm next
              btnNext.onclick= function(){
               if(app.isRandom){
                app.nextRandom()
               } else{
                app.nextSong()
               }
                audio.play()
                app.render()
                app.scrollToActiveSong()

              }

              // xử lý bấm prev

              btnPrev.onclick = function(){
               if(app.isRandom){
                app.nextRandom()
               } else{
                 app.prevSong()
               }
                audio.play()
                app.render()
                app.scrollToActiveSong()

              }

              // xử lý cho random nhạc 
              btnRandom.onclick = function(){
                app.isRandom = !app.isRandom
                btnRandom.classList.toggle('active', app.isRandom)
              }

              // xử lý auto replay bài hát

              btnReplay.onclick = function(){
                app.isReplay = !app.isReplay
                btnReplay.classList.toggle('active', app.isReplay)
              }

              audio.onended = function() {
                if(app.isReplay){
                  audio.play()
                app.render()
                  
                } else{
                  btnNext.click()
                }
              }

              // xử lý bấm vào bài hát thì chuyển bài

              playList.onclick = function(e) {

                const songElement = e.target.closest('.song:not(.active)')
                const songOption = e.target.closest('.option')
                if(songElement|| songOption){
                    // xử lý khi click vào song 
                    if(e.target.closest('.song:not(.active)')){
                    app.currentIndex = Number(songElement.dataset.index) 
                    app.loadCurrentSong()
                    app.render()
                    audio.play()
                      
                    }

                    // xử lý khi click vào option 
                     if (e.target.closest('.option')){
                      
                     }
                } 
              }





        },
        // defineProperties
        defineProperties: function() {


          Object.defineProperty(this, "currentSong", {
            get : function() {
              return this.songs[this.currentIndex]
            }
          })


        },

        loadCurrentSong : function() {
          heading.textContent = this.currentSong.name
          cdThumb.style.backgroundImage=`url('${this.currentSong.image}')`
          audio.src = this.currentSong.path
        },

        nextSong : function(){
          this.currentIndex++
          if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
          }

          this.loadCurrentSong()
        },

        prevSong : function(){
          this.currentIndex--
          if(this.currentIndex < 0){
            this.currentIndex = this.songs.length -1
          }

          this.loadCurrentSong()
        },

        nextRandom : function(){
            let  newIndex
          do {
            newIndex = Math.floor(Math.random()* this.songs.length)
            } while(newIndex===this.currentIndex)
          this.currentIndex = newIndex
          this.loadCurrentSong()
        },


        scrollToActiveSong : function(){
          setTimeout(
            $('.song.active').scrollIntoView({
              behavior : 'smooth',
              block : 'end'
            })
          , 300)
        },
  

      
    //start
    start: function() {
        // tự định nghĩa thêm thuộc tính 
        this.defineProperties()

        // trượt bài hát để thủ nhỏ cd
        this.handleEvent()

        // xuất bài hát hiện tại
        this.loadCurrentSong()

         // xuất sang DOM
        this.render()
    }


}


app.start()