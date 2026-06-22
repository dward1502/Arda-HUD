FROM ubuntu:22.04
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs

RUN apt-get update && apt-get install -y \
    curl wget git build-essential pkg-config \
    libgtk-3-0 libgtk-3-dev \
    libwebkit2gtk-4.1-0 libwebkit2gtk-4.1-dev \
    libjavascriptcoregtk-4.1-dev libsoup-3.0-dev \
    libgdk-pixbuf-2.0-dev libpango1.0-dev libatk1.0-dev \
    libcairo2-dev libharfbuzz-dev \
    libx11-dev libxext-dev libxrandr-dev libxi-dev \
    libxcursor-dev libxdamage-dev libxinerama-dev \
    libxcomposite-dev libxrender-dev libxkbcommon-dev \
    libwayland-dev libglib2.0-dev libfontconfig1-dev \
    libfreetype6-dev libpng-dev libssl-dev libcurl4-openssl-dev \
    libzstd-dev liblzma-dev xdg-utils

RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"
RUN cargo install tauri-cli

WORKDIR /app
COPY . /app
RUN npm install
RUN npm run tauri build -- --bundles deb

CMD ["ls", "-la", "/app/src-tauri/target/release/"]
