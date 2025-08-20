cmake_minimum_required(VERSION 3.31)
project(studywithme)

set(CMAKE_CXX_STANDARD 14)

include_directories(frontend/node_modules/bcrypt/src)
include_directories(frontend/node_modules/node-addon-api)
include_directories(frontend/node_modules/sharp/src)

add_executable(studywithme
        frontend/node_modules/bcrypt/src/bcrypt.cc
        frontend/node_modules/bcrypt/src/bcrypt_node.cc
        frontend/node_modules/bcrypt/src/blowfish.cc
        frontend/node_modules/bcrypt/src/node_blf.h
        frontend/node_modules/node-addon-api/napi-inl.deprecated.h
        frontend/node_modules/node-addon-api/napi-inl.h
        frontend/node_modules/node-addon-api/napi.h
        frontend/node_modules/node-addon-api/nothing.c
        frontend/node_modules/sharp/src/common.cc
        frontend/node_modules/sharp/src/common.h
        frontend/node_modules/sharp/src/metadata.cc
        frontend/node_modules/sharp/src/metadata.h
        frontend/node_modules/sharp/src/operations.cc
        frontend/node_modules/sharp/src/operations.h
        frontend/node_modules/sharp/src/pipeline.cc
        frontend/node_modules/sharp/src/pipeline.h
        frontend/node_modules/sharp/src/sharp.cc
        frontend/node_modules/sharp/src/stats.cc
        frontend/node_modules/sharp/src/stats.h
        frontend/node_modules/sharp/src/utilities.cc
        frontend/node_modules/sharp/src/utilities.h)
