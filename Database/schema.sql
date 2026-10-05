from flask import Flask
import mysql.connector
import os

app = Flask(__name__)


def get_db_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME", "ecommerce")
    )


@app.route("/")
def home():
    return "E-Commerce Application Tier is Working!"


@app.route("/products")
def products():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM products")
    products = cursor.fetchall()

    cursor.close()
    db.close()

    result = "<h1>Products</h1>"

    for product in products:
        result += f"""
        <p>
            <b>{product['name']}</b> -
            Rs.{product['price']} -
            Stock: {product['stock']}
        </p>
        """

    return result


@app.route("/api/products")
def api_products():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM products")
    products = cursor.fetchall()

    cursor.close()
    db.close()

    return products


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
