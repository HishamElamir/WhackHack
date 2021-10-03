FROM python:3.6.5
# Set the working directory to /app
WORKDIR /app
# Copy local contents into the container
ADD . /app
# Install all required dependencies
RUN pip install -r requirements.txt

EXPOSE 5000
# CMD ["python", "app.py", "--host=0.0.0.0"]
CMD ["flask", "run", "--host", "0.0.0.0" ]