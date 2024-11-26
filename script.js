let bolas = [];
let barras = [];
const svgNS = "http://www.w3.org/2000/svg";

let puntosIzquierda = 0;
let puntosDerecha = 0;

let moverArribaIzq = false;
let moverAbajoIzq = false;
let moverArribaDer = false;
let moverAbajoDer = false;


window.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "w": // Mover barra izquierda hacia arriba
            moverArribaIzq = true;
            break;
        case "s": // Mover barra izquierda hacia abajo
            moverAbajoIzq = true;
            break;
        case "ArrowUp": // Mover barra derecha hacia arriba
            moverArribaDer = true;
            break;
        case "ArrowDown": // Mover barra derecha hacia abajo
            moverAbajoDer = true;
            break;
    }
});

window.addEventListener("keyup", (event) => {
    switch (event.key) {
        case "w": // Detener movimiento hacia arriba de la barra izquierda
            moverArribaIzq = false;
            break;
        case "s": // Detener movimiento hacia abajo de la barra izquierda
            moverAbajoIzq = false;
            break;
        case "ArrowUp": // Detener movimiento hacia arriba de la barra derecha
            moverArribaDer = false;
            break;
        case "ArrowDown": // Detener movimiento hacia abajo de la barra derecha
            moverAbajoDer = false;
            break;
    }
});


setInterval(() => {
    bolas.forEach((bola) => bola.mover());
    if (moverAbajoIzq) barras[0].mover(1);
    if (moverArribaIzq) barras[0].mover(-1);
    if (moverAbajoDer) barras[1].mover(1);
    if (moverArribaDer) barras[1].mover(-1);
}, 30);


window.onload = () => {
    // Crear una bola inicial
    crearNuevaBola();

    // Crear barras (jugadores)
    barras.push(new Barra("juego", 10, 200, 0, 0));        // Barra izquierda
    barras.push(new Barra("juego", 10, 200, 0, 1910));     // Barra derecha

    // Actualizar movimiento periódicamente
    setInterval(() => {
        bolas.forEach((bola) => bola.mover());
        if (moverAbajoIzq) barras[0].mover(1);
        if (moverArribaIzq) barras[0].mover(-1);
        if (moverAbajoDer) barras[1].mover(1);
        if (moverArribaDer) barras[1].mover(-1);
    }, 30);
};

// Crear una nueva bola
function crearNuevaBola() {
    bolas.push(new Bola("juego", 960, 500, 35, 15, 15, 1920, 1000));
}

// Actualizar marcador
function actualizarMarcador() {
    document.getElementById("puntosIzquierda").textContent = puntosIzquierda;
    document.getElementById("puntosDerecha").textContent = puntosDerecha;
}

// Clase Bola
class Bola {
    constructor(svgPadre, x = 50, y = 50, radio = 50, velX = 100, velY = 100, sizeX = 1920, sizeY = 1080) {
        this.posicionX = x;
        this.posicionY = y;
        this.r = radio;
        this.velocidadX = velX;
        this.velocidadY = velY;
        this.limiteX = sizeX;
        this.limiteY = sizeY;
        this.elemento = this.crearTag(svgPadre);
    }

    crearTag(svgPadre) {
        let bola = document.createElementNS(svgNS, "circle");
        bola.setAttribute("cx", this.posicionX);
        bola.setAttribute("cy", this.posicionY);
        bola.setAttribute("r", this.r);
        bola.setAttribute("fill", "black");
        document.getElementById(svgPadre).appendChild(bola);
        return bola;
    }

    mover() {
        this.posicionX += this.velocidadX;
        this.posicionY += this.velocidadY;

        // Rebote en bordes superior e inferior
        if (this.posicionY - this.r <= 0 || this.posicionY + this.r >= this.limiteY) {
            this.velocidadY *= -1;
        }

        // Colisión con barra izquierda
        let barraIzq = barras[0];
        if (
            this.posicionX - this.r <= barraIzq.posicionX + barraIzq.Bwidth &&
            this.posicionY + this.r >= barraIzq.posicionY &&
            this.posicionY - this.r <= barraIzq.posicionY + barraIzq.Bheight
        ) {
            this.velocidadX *= -1;
            this.posicionX = barraIzq.posicionX + barraIzq.Bwidth + this.r;
        }

        // Colisión con barra derecha
        let barraDer = barras[1];
        if (
            this.posicionX + this.r >= barraDer.posicionX &&
            this.posicionY + this.r >= barraDer.posicionY &&
            this.posicionY - this.r <= barraDer.posicionY + barraDer.Bheight
        ) {
            this.velocidadX *= -1;
            this.posicionX = barraDer.posicionX - this.r;
        }

        // Salida por izquierda
        if (this.posicionX + this.r < 0) {
            puntosDerecha++;
            actualizarMarcador();
            this.eliminar();
            crearNuevaBola();
            return;
        }

        // Salida por derecha
        if (this.posicionX - this.r > this.limiteX) {
            puntosIzquierda++;
            actualizarMarcador();
            this.eliminar();
            crearNuevaBola();
            return;
        }

        this.actualizarPosicion();
    }

    actualizarPosicion() {
        this.elemento.setAttribute("cx", this.posicionX);
        this.elemento.setAttribute("cy", this.posicionY);
    }

    eliminar() {
        this.elemento.remove();
        let index = bolas.indexOf(this);
        if (index > -1) {
            bolas.splice(index, 1);
        }
    }
}

// Clase Barra
class Barra {
    constructor(svgPadre, width = 10, height = 200, y = 0, x = 0) {
        this.Bwidth = width;
        this.Bheight = height;
        this.posicionY = y;
        this.posicionX = x;
        this.velocidadY = 25;
        this.limiteY = 1000 - height;

        this.elemento = this.crearTag(svgPadre);
    }

    crearTag(svgPadre) {
        let barra = document.createElementNS(svgNS, "rect");
        barra.setAttribute("x", this.posicionX);
        barra.setAttribute("y", this.posicionY);
        barra.setAttribute("width", this.Bwidth);
        barra.setAttribute("height", this.Bheight);
        barra.setAttribute("fill", "black");
        document.getElementById(svgPadre).appendChild(barra);
        return barra;
    }

    mover(direccion) {
        this.posicionY += direccion * this.velocidadY;

        if (this.posicionY < 0) this.posicionY = 0;
        if (this.posicionY > this.limiteY) this.posicionY = this.limiteY;

        this.actualizarPosicion();
    }

    actualizarPosicion() {
        this.elemento.setAttribute("y", this.posicionY);
    }
}
