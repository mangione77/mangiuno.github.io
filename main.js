const navToggle = document.querySelector(".nav-toggle")
const navMenu = document.querySelector(".nav-menu")
const selectServiceButtons = document.querySelectorAll(".select-service")
const selectedList = document.getElementById("selected-list")
const totalAmount = document.getElementById("total-amount")
const subtotalAmount = document.getElementById("subtotal-amount")
const discountAmount = document.getElementById("discount-amount")
const addToCartButton = document.getElementById("add-to-cart")
const paymentModal = document.getElementById("payment-modal")
const modalCloseButton = document.querySelector(".modal-close")
const modalServices = document.getElementById("modal-services")
const modalTotal = document.getElementById("modal-total")
const modalSubtotal = document.getElementById("modal-subtotal")
const modalDiscount = document.getElementById("modal-discount")
const mercadoLibreButton = document.getElementById("mercadolibre-btn")
const paypalButton = document.getElementById("paypal-btn")
const subscriptionForm = document.getElementById("subscription-form")
const subscriptionEmail = document.getElementById("subscription-email")
const subscriptionSuccess = document.getElementById("subscription-success")
const discountNotice = document.getElementById("discount-notice")
const savingsMessage = document.getElementById("savings-message")
const savingsAmount = document.getElementById("savings-amount")

let selectedServices = []
let subtotalPrice = 0
let discount = 0
let finalPrice = 0
// TODO: check for subscription
let isSubscribed = false

function init() {
  navToggle.addEventListener("click", toggleMobileMenu)

  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", closeMobileMenu)
  })

  selectServiceButtons.forEach(button => {
    button.addEventListener("click", handleServiceSelection)
  })

  addToCartButton.addEventListener("click", openPaymentModal)

  modalCloseButton.addEventListener("click", closePaymentModal)

  paymentModal.addEventListener("click", e => {
    if (e.target === paymentModal) {
      closePaymentModal()
    }
  })

  mercadoLibreButton.addEventListener("click", handleMercadoLibrePayment)
  paypalButton.addEventListener("click", handlePayPalPayment)

  subscriptionForm.addEventListener("submit", handleSubscription)

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && paymentModal.style.display === "flex") {
      closePaymentModal()
    }
  })

  // TODO: change this to serverless mailchimp function
  loadSelectedServicesFromStorage()
  loadSubscriptionStatus()

  updateSelectedServicesUI()
}

function toggleMobileMenu() {
  navMenu.classList.toggle("active")
  navToggle.classList.toggle("active")

  const spans = navToggle.querySelectorAll("span")
  if (navMenu.classList.contains("active")) {
    spans[0].style.transform = "rotate(45deg) translate(5px, 5px)"
    spans[1].style.opacity = "0"
    spans[2].style.transform = "rotate(-45deg) translate(7px, -6px)"
  } else {
    spans[0].style.transform = "none"
    spans[1].style.opacity = "1"
    spans[2].style.transform = "none"
  }
}

function closeMobileMenu() {
  navMenu.classList.remove("active")
  navToggle.classList.remove("active")

  const spans = navToggle.querySelectorAll("span")
  spans[0].style.transform = "none"
  spans[1].style.opacity = "1"
  spans[2].style.transform = "none"
}

function handleServiceSelection(e) {
  const button = e.currentTarget
  const serviceItem = button.closest(".service-item")
  const serviceId = serviceItem.dataset.service
  const serviceName = serviceItem.querySelector(".service-name").textContent
  const servicePrice = parseInt(serviceItem.dataset.price)

  const existingIndex = selectedServices.findIndex(
    service => service.id === serviceId
  )

  if (existingIndex >= 0) {
    selectedServices.splice(existingIndex, 1)
    button.textContent = "SELECCIONAR"
    button.classList.remove("selected")
    serviceItem.classList.remove("selected")
  } else {
    selectedServices.push({
      id: serviceId,
      name: serviceName,
      price: servicePrice
    })
    button.textContent = "SELECCIONADO"
    button.classList.add("selected")
    serviceItem.classList.add("selected")
  }

  updateSelectedServicesUI()
  saveSelectedServicesToStorage()
}

function updateSelectedServicesUI() {
  subtotalPrice = selectedServices.reduce(
    (sum, service) => sum + service.price,
    0
  )

  if (isSubscribed && subtotalPrice > 0) {
    discount = Math.round(subtotalPrice * 0.15)
    discountNotice.style.display = "flex"
  } else {
    discount = 0
    discountNotice.style.display = "none"
  }

  finalPrice = subtotalPrice - discount

  subtotalAmount.textContent = `$${subtotalPrice.toLocaleString("es")} ARS`
  discountAmount.textContent = `-$${discount.toLocaleString("es")} ARS`
  totalAmount.textContent = `$${finalPrice.toLocaleString("es")} ARS`

  if (selectedServices.length === 0) {
    selectedList.innerHTML =
      '<p class="empty-selection">Todavía no seleccionaste ningún servicio.</p>'
    addToCartButton.disabled = true
  } else {
    selectedList.innerHTML = ""
    selectedServices.forEach(service => {
      const serviceElement = document.createElement("div")
      serviceElement.className = "selected-service-item"
      serviceElement.innerHTML = `
                <div class="service-name-price">
                    <span class="service-item-name">${service.name}</span>
                    <span class="service-item-price">$${service.price.toLocaleString(
                      "es-AR"
                    )} ARS</span>
                </div>
                <button class="remove-service" data-id="${
                  service.id
                }">&times;</button>
            `
      selectedList.appendChild(serviceElement)
    })

    document.querySelectorAll(".remove-service").forEach(button => {
      button.addEventListener("click", handleRemoveService)
    })

    addToCartButton.disabled = false
  }
}

function handleRemoveService(e) {
  const serviceId = e.currentTarget.dataset.id
  const serviceItem = document.querySelector(
    `.service-item[data-service="${serviceId}"]`
  )
  const serviceButton = serviceItem.querySelector(".select-service")

  selectedServices = selectedServices.filter(
    service => service.id !== serviceId
  )

  serviceButton.textContent = "SELECCIONAR"
  serviceButton.classList.remove("selected")
  serviceItem.classList.remove("selected")

  updateSelectedServicesUI()
  saveSelectedServicesToStorage()
}

function openPaymentModal() {
  if (selectedServices.length === 0) return

  modalServices.innerHTML = ""
  selectedServices.forEach(service => {
    const serviceElement = document.createElement("div")
    serviceElement.className = "modal-service-item"
    serviceElement.innerHTML = `
            <span>${service.name}</span>
            <span>$${service.price.toLocaleString("es-AR")} ARS</span>
        `
    modalServices.appendChild(serviceElement)
  })

  modalSubtotal.textContent = `$${subtotalPrice.toLocaleString("es-AR")} ARS`
  modalDiscount.textContent = `-$${discount.toLocaleString("es-AR")} ARS`
  modalTotal.textContent = `$${finalPrice.toLocaleString("es-AR")} ARS`

  if (isSubscribed && discount > 0) {
    savingsAmount.textContent = `$${discount.toLocaleString("es-AR")}`
    savingsMessage.style.display = "flex"
  } else {
    savingsMessage.style.display = "none"
  }

  paymentModal.style.display = "flex"
  document.body.style.overflow = "hidden"
}

function closePaymentModal() {
  paymentModal.style.display = "none"
  document.body.style.overflow = "auto"
}

// TODO: Add actual mercadolibre serverless function to handle payments
function handleMercadoLibrePayment() {
  const message =
    isSubscribed && discount > 0
      ? `Procesando pago a través de MercadoLibre...\n\nSubtotal: $${subtotalPrice.toLocaleString(
          "es-AR"
        )} ARS\nDescuento (15%): -$${discount.toLocaleString(
          "es-AR"
        )} ARS\nTOTAL: $${finalPrice.toLocaleString(
          "es-AR"
        )} ARS\n\n¡Ahorraste $${discount.toLocaleString(
          "es-AR"
        )} con tu suscripción!\n\n(Esta es una simulación, no se realizará ningún cargo real.)`
      : `Procesando pago a través de MercadoLibre...\n\nTOTAL: $${finalPrice.toLocaleString(
          "es-AR"
        )} ARS\n\n(Esta es una simulación, no se realizará ningún cargo real.)`

  alert(message)
  closePaymentModal()
  clearSelectedServices()
}

// TODO: Change this to use paypal's API with a serverless function
function handlePayPalPayment() {
  const message =
    isSubscribed && discount > 0
      ? `Procesando pago a través de PayPal...\n\nSubtotal: $${subtotalPrice.toLocaleString(
          "es-AR"
        )} ARS\nDescuento (15%): -$${discount.toLocaleString(
          "es-AR"
        )} ARS\nTOTAL: $${finalPrice.toLocaleString(
          "es-AR"
        )} ARS\n\n¡Ahorraste $${discount.toLocaleString(
          "es-AR"
        )} con tu suscripción!\n\n(Esta es una simulación, no se realizará ningún cargo real.)`
      : `Procesando pago a través de PayPal...\n\nTOTAL: $${finalPrice.toLocaleString(
          "es-AR"
        )} ARS\n\n(Esta es una simulación, no se realizará ningún cargo real.)`

  alert(message)
  closePaymentModal()
  clearSelectedServices()
}

function handleSubscription(e) {
  e.preventDefault()

  const email = subscriptionEmail.value.trim()

  if (!email || !isValidEmail(email)) {
    alert("Por favor, ingresá un email válido.")
    return
  }

  // TODO: IMPLEMENT FETCH REQUEST TO MAILCHIMP WITH NEW EMAIL
  alert("Subscribing email:", email)

  setTimeout(() => {
    isSubscribed = true
    saveSubscriptionStatus(true)
    subscriptionSuccess.style.display = "block"
    subscriptionForm.style.display = "none"
    updateSelectedServicesUI()
    showDiscountNotification()
  }, 500)
}

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

function showDiscountNotification() {
  const notification = document.createElement("div")
  notification.className = "floating-discount-notification"
  notification.innerHTML = `
    <span>🎵 ¡Descuento 15% aplicado!</span>
  `
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: var(--neon-green);
    color: var(--bg-dark);
    padding: 1rem 1.5rem;
    border-radius: 8px;
    font-family: var(--font-pixel);
    font-weight: 700;
    z-index: 10000;
    animation: slideInRight 0.5s ease;
    box-shadow: 0 5px 15px rgba(0, 255, 157, 0.3);
  `

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.5s ease"
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 500)
  }, 5000)
}

const style = document.createElement("style")
style.textContent = `
  @keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`
document.head.appendChild(style)

function clearSelectedServices() {
  selectedServices.forEach(service => {
    const serviceItem = document.querySelector(
      `.service-item[data-service="${service.id}"]`
    )
    if (serviceItem) {
      const serviceButton = serviceItem.querySelector(".select-service")
      serviceButton.textContent = "SELECCIONAR"
      serviceButton.classList.remove("selected")
      serviceItem.classList.remove("selected")
    }
  })

  selectedServices = []
  updateSelectedServicesUI()
  saveSelectedServicesToStorage()
}

function saveSelectedServicesToStorage() {
  try {
    localStorage.setItem(
      "mangiSelectedServices",
      JSON.stringify(selectedServices)
    )
  } catch (e) {
    // TODO: Implement proper error handling to avoid using alerts and showing internal errors to users.  rn for mobile debugging comes in handy
    alert("Could not save to localStorage:", e)
  }
}

function saveSubscriptionStatus(subscribed) {
  try {
    localStorage.setItem("mangiSubscribed", JSON.stringify(subscribed))
  } catch (e) {
    alert("Could not save subscription status:", e)
  }
}

function loadSelectedServicesFromStorage() {
  try {
    const savedServices = localStorage.getItem("mangiSelectedServices")
    if (savedServices) {
      selectedServices = JSON.parse(savedServices)

      selectedServices.forEach(service => {
        const serviceItem = document.querySelector(
          `.service-item[data-service="${service.id}"]`
        )
        if (serviceItem) {
          const serviceButton = serviceItem.querySelector(".select-service")
          serviceButton.textContent = "SELECCIONADO"
          serviceButton.classList.add("selected")
          serviceItem.classList.add("selected")
        }
      })
    }
  } catch (e) {
    alert("Could not load from localStorage:", e)
    selectedServices = []
  }
}

function loadSubscriptionStatus() {
  try {
    const savedStatus = localStorage.getItem("mangiSubscribed")
    if (savedStatus) {
      isSubscribed = JSON.parse(savedStatus)

      if (isSubscribed) {
        subscriptionSuccess.style.display = "block"
        subscriptionForm.style.display = "none"
      }
    }
  } catch (e) {
    console.warn("Could not load subscription status:", e)
    isSubscribed = false
  }
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()

    const targetId = this.getAttribute("href")
    if (targetId === "#") return

    const targetElement = document.querySelector(targetId)
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: "smooth"
      })
    }
  })
})

document.addEventListener("DOMContentLoaded", init)
