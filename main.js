document.addEventListener("DOMContentLoaded", function () {
  const projects = [
    {
      title: "Moonbowns - Blu",
      description:
        'Producción completa, mezcla y mastering del track "Blu" de Moonbowns. Desarrollo de sonido atmosférico y texturas etéreas con enfoque en la emoción y profundidad sonora. Mastering optimizado para plataformas digitales con énfasis en la dinámica y claridad.',
      tags: ["Producción Completa", "Mezcla", "Mastering"],
      mediaType: "spotify",
      mediaUrl:
        "https://open.spotify.com/track/2R3ZpvhPXUY2ESwv4etjU7?si=a954fe3cfc7e4b89",
      behanceUrl: "https://www.behance.net/santiagmangion"
    },
    {
      title: "VALI x Paulx x MANGI - Como un viento suave",
      description:
        "Producción completa en colaboración con VALI y Paulx. Creación de ambiente melódico con instrumentación acústica y electrónica. Trabajo de arreglos, mezcla y mastering para plataforma digital.",
      tags: ["Producción Completa", "Colaboración", "Mezcla"],
      mediaType: "youtube",
      mediaUrl: "https://www.youtube.com/watch?v=ihMDLt6O8Do",
      behanceUrl: "https://www.behance.net/santiagmangion"
    },
    {
      title: "Arizona - Mat Graciano",
      description:
        'Producción completa del tema "Arizona". Desarrollo de sonido característico con elementos de folk y música contemporánea. Mezcla balanceada y mastering optimizado para distribución digital.',
      tags: ["Producción Completa", "Folk", "Mastering"],
      mediaType: "youtube",
      mediaUrl: "https://www.youtube.com/watch?v=ihMDLt6O8Do",
      behanceUrl: "https://www.behance.net/santiagmangion"
    },
    {
      title: "Andi Arias ft Lolita Fiamma - Plegarse",
      description:
        'Mastering profesional del tema "Plegarse". Optimización de niveles, ecualización y compresión para competir en plataformas streaming. Enfoque en claridad vocal y balance instrumental.',
      tags: ["Mastering", "Vocal", "Optimización"],
      mediaType: "youtube",
      mediaUrl: "https://www.youtube.com/watch?v=8sy-idvAyG8",
      behanceUrl: "https://www.behance.net/santiagmangion"
    },
    {
      title: "A Nice Afternoon at Brooklyn - Mangi ft DirJones",
      description:
        "Producción completa del tema con DirJones, desde USA. Creación de ritmo de rap con pianos y arreglos que recuerdan al sonido de la costa este. Mezcla con énfasis en graves definidos y claridad vocal. Mastering para plataformas digitales.",
      tags: ["Producción Completa", "Rap", "Mastering", "Mezcla"],
      mediaType: "spotify",
      mediaUrl:
        "https://open.spotify.com/track/2Igw2L2iXIGiQX8othyo2Y?si=b021efbf39264f5e",
      behanceUrl: "https://www.behance.net/santiagmangion"
    },
    {
      title: "Frutilla Con Crema - Liebre",
      description:
        'Grabación profesional de teclados para el tema "Liebre". Captura de performance en vivo con equipo de alta calidad. Procesamiento y edición para integración perfecta en la mezcla final.',
      tags: ["Grabación", "Teclados", "Live"],
      mediaType: "youtube",
      mediaUrl: "https://www.youtube.com/watch?v=fJKhP6muqik",
      behanceUrl: "https://www.behance.net/santiagmangion"
    }
  ]

  const projectCards = document.querySelectorAll(".project-card")

  if (projectCards.length === projects.length) {
    projectCards.forEach((card, index) => {
      const project = projects[index]

      const titleElement = card.querySelector(".project-title")
      const descriptionElement = card.querySelector(".project-description")
      const tagsContainer = card.querySelector(".project-tags")
      const behanceButton = card.querySelector(".project-behance-btn")
      const embeddedPlayer = card.querySelector(".embedded-player")

      if (titleElement) {
        titleElement.textContent = project.title
      }

      if (descriptionElement) {
        descriptionElement.textContent = project.description
      }

      if (tagsContainer) {
        tagsContainer.innerHTML = ""
        project.tags.forEach(tag => {
          const tagElement = document.createElement("span")
          tagElement.className = "project-tag"
          tagElement.textContent = tag
          tagsContainer.appendChild(tagElement)
        })
      }

      if (behanceButton) {
        behanceButton.href = project.behanceUrl
      }

      if (embeddedPlayer) {
        if (project.mediaType === "spotify") {
          const iframe = embeddedPlayer.querySelector("iframe")
          if (iframe) {
            iframe.src = `https://open.spotify.com/embed/track/${
              project.mediaUrl.split("/track/")[1]?.split("?")[0]
            }`
            iframe.style.width = "100%"
            iframe.style.height = "80px"
            iframe.style.borderRadius = "6px"
            iframe.style.marginTop = "10px"
          }
        } else if (project.mediaType === "youtube") {
          const iframe = embeddedPlayer.querySelector("iframe")
          if (iframe) {
            iframe.src = `https://www.youtube.com/embed/${
              project.mediaUrl.split("v=")[1]?.split("&")[0]
            }`
            iframe.style.width = "100%"
            iframe.style.height = "160px"
            iframe.style.borderRadius = "6px"
            iframe.style.marginTop = "10px"
          }
        }
      }
    })
  }

  const descriptionScrolls = document.querySelectorAll(
    ".project-description-scroll"
  )
  descriptionScrolls.forEach(scroll => {
    scroll.addEventListener("scroll", function () {
      this.classList.add("scrolling")
    })

    scroll.addEventListener("mouseleave", function () {
      setTimeout(() => {
        this.classList.remove("scrolling")
      }, 2000)
    })
  })

  const navToggle = document.querySelector(".nav-toggle")
  const navMenu = document.querySelector(".nav-menu")

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      navMenu.classList.toggle("active")
      this.classList.toggle("active")

      const spans = this.querySelectorAll("span")
      if (navMenu.classList.contains("active")) {
        spans[0].style.transform = "rotate(45deg) translate(5px, 5px)"
        spans[1].style.opacity = "0"
        spans[2].style.transform = "rotate(-45deg) translate(7px, -6px)"
      } else {
        spans[0].style.transform = "none"
        spans[1].style.opacity = "1"
        spans[2].style.transform = "none"
      }
    })

    document.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", function () {
        navMenu.classList.remove("active")
        navToggle.classList.remove("active")

        const spans = navToggle.querySelectorAll("span")
        spans[0].style.transform = "none"
        spans[1].style.opacity = "1"
        spans[2].style.transform = "none"
      })
    })
  }
})
