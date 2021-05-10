#!/bin/bash

rabbitmqadmin declare queue name=v1eligible durable=false

rabbitmqadmin declare queue name=v2eligible durable=false