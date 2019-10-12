FROM python:3.7-alpine
RUN pip install google-api-python-client
ADD resume-mdl-209aeff2da09.json .
ADD get_welcome.py .
CMD ["python", "get_welcome.py"]