from app import create_app
import os

app = create_app()

if __name__ == '__main__':
    # Use 0.0.0.0 in Docker, 127.0.0.1 for local Windows (IPv6 fix)
    host = os.environ.get('FLASK_HOST', '127.0.0.1')
    debug = os.environ.get('FLASK_DEBUG', '1') == '1'
    app.run(host=host, port=5000, debug=debug)
