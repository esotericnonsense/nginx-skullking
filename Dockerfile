FROM nginx:latest
COPY public_html /usr/share/nginx/html
COPY _git_status /usr/share/nginx/html/
