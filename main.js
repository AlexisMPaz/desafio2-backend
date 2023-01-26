import { promises as fs } from 'fs'


// Clases para Manager y Producto
class ProductManager {
    constructor(path) {
        this.path = path
    }

    async addProduct(newProduct) {
        if (Object.values(newProduct).includes("") || Object.values(newProduct).includes(null)) {
            console.error("Error 1: No se ha podido agregar el producto ya que posee campos incompletos");

        } else {
            const dataBase = await fs.readFile(this.path, 'utf-8');
            const aux = JSON.parse(dataBase);
            const product = aux.find(prod => prod.code === newProduct.code);

            if (!product) {
                aux.push({ ...newProduct, id: ProductManager.idGenerator() });
                await fs.writeFile(this.path, JSON.stringify(aux))

            } else {
                console.error("Error 2: El producto esta repetido");
            }
        }
    }

    async getProducts() {
        const dataBase = await fs.readFile(this.path, 'utf-8');
        const aux = JSON.parse(dataBase);
        console.log(aux);
    }


    async getProductByID(idProduct) {
        const dataBase = await fs.readFile(this.path, 'utf-8');
        const aux = JSON.parse(dataBase);
        const product = aux.find(prod => prod.id === idProduct);
        if (product) {
            console.log(product);
        } else {
            console.error("Error 3: Producto no encontrado");
        }
    }

    async updateProduct(newProduct, idProduct) {
        if (Object.values(newProduct).includes("") || Object.values(newProduct).includes(null)) {
            console.error("Error 1: No se ha podido agregar el producto ya que posee campos incompletos")

        } else {
            const dataBase = await fs.readFile(this.path, 'utf-8');
            const aux = JSON.parse(dataBase);
            const product = aux.find(prod => prod.id === idProduct);
            if(product) {
                const indice = aux.findIndex(prod => prod.id === idProduct);
                aux[indice] = {...newProduct, id:idProduct};
                await fs.writeFile(this.path, JSON.stringify(aux));
                console.log(`El producto (id:${idProduct}) ha sido actualizado`);
            } else {
                console.log("Error 3: Producto no encontrado");
            }
        }
    }

    async deleteProduct(idProduct) {
        const dataBase = await fs.readFile(this.path, 'utf-8');
        const aux = JSON.parse(dataBase);
        const product = aux.find(prod => prod.id === idProduct);
        if(product) {
            const newArray = aux.filter(prod => prod.id !== idProduct)
            await fs.writeFile(this.path, JSON.stringify(newArray));
            console.log(`El producto (id:${idProduct}) ha sido eliminado`);
        } else {
            console.log("Error 3: Producto no encontrado");
        }
    }

    //Metodo estatico para generar ID al cargar producto
    static idGenerator() {
        this.generatedID ? this.generatedID++ : this.generatedID = 1;
        return this.generatedID;
    }
}

class Product {
    constructor(title, description, price, thumbnail, code, stock) {
        this.title = title
        this.description = description
        this.price = price
        this.thumbnail = thumbnail
        this.code = code
        this.stock = stock
    }
}

// Creacion del Manager y los productos

const manager1 = new ProductManager("./productsManager1.txt");

const product1 = new Product("Producto prueba", "Este es un producto de prueba", 200, "Sin Imagen", "abc123", 25);
const product2 = new Product("Producto prueba 2", "Este es el segundo producto de prueba", 500, "Sin Imagen", "abc456", 25);


const product1Update = new Product("Producto prueba actualizado", "Este es el producto 1 actualizado", 400, "Sin Imagen", "abc123", 25);

// TESTEO

const test = async () => {
    await fs.writeFile("./productsManager1.txt", "[]") //Iniciar base de datos con array vacio (archivo de texto)

    await manager1.getProducts(); //Muestra por consola el array vacio

    //Productos cargados
    await manager1.addProduct(product1);
    await manager1.addProduct(product2);

    await manager1.getProducts(); //Muestra por consola los productos cargados

    await manager1.getProductByID(2); //Producto encontrado (mostrado por consola)
    await manager1.getProductByID(5); //Producto no encontrado (error por consola)

    await manager1.updateProduct(product1Update, 1) //Actualiza el producto id:1 con los nuevos campos
    await manager1.getProductByID(1); //Muestra por consola el producto actualizado

    await manager1.deleteProduct(6); //No encuentra el producto para eliminar (error por consola)
    await manager1.deleteProduct(2); //Elimina el producto 2

    await manager1.getProducts(); //Muestra el array por consola con solo el producto 1 actualizado
}

test();