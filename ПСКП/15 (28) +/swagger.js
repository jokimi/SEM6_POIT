let openapi = {
    openapi: '3.1.1',
    paths: {
        '/ts': {
            get: {
                tags: ['CRUD'],
                description: 'Получить список из справочника',
                operationId: 'getTS',
                responses: {
                    '200': {
                        description: 'Номера телефонов',
                        content: {
                            'application/json': {
                                schema: { type: 'object' },
                                example: [
                                    {
                                        'number': '+375291234567',
                                        'name': 'John Doe'
                                    },
                                    {
                                        'number': '+375339876543',
                                        'name': 'Jane Doe'
                                    },
                                ]
                            }
                        }
                    }
                }
            },
            post: {
                tags: ['CRUD'],
                description: 'Добавление нового номера в справочник',
                operationId: 'postTS',
                requestBody: {
                    content: {
                        'application/json': {
                            schema: { type: 'object' },
                            required: true,
                            description: 'Новый номер',
                            example: {
                                'number': '+375291234567',
                                'name': 'John Doe'
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Сообщение о создании новой записи в справочнике',
                        content: {
                            'application/json': {
                                schema: { type: 'object' },
                                example: {
                                    message: '[OK] 200: Номер добавлен в справочник.'
                                }
                            }
                        }
                    },
                    '400': {
                        description: 'Сообщение о неверных параметрах',
                        content: {
                            'application/json': {
                                schema: { type: 'object' },
                                example: {
                                    message: '[ERROR] 400: Неверные параметры.'
                                }
                            }
                        }
                    }
                }
            },
            put: {
                tags: ['CRUD'],
                description: 'Изменение номера в справочнике',
                operationId: 'putTS',
                requestBody: {
                    content: {
                        'application/json': {
                            schema: { type: 'object' },
                            required: true,
                            description: 'Обновленная запись',
                            example: {
                                'number': '+375291234561',
                                'name': 'John Doe'
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Сообщение об обновлении записи',
                        content: {
                            'application/json': {
                                schema: { type: 'object' },
                                example: {
                                    message: '[OK] 200: Запись обновлена.'
                                }
                            }
                        }
                    },
                    '400': {
                        description: 'Сообщение о неверных параметрах',
                        content: {
                            'application/json': {
                                schema: { type: 'object' },
                                example: {
                                    message: '[ERROR] 400: Неверные параметры.'
                                }
                            }
                        }
                    }
                }
            },
            delete: {
                tags: ['CRUD'],
                description: 'Удаление номера из справочника',
                operationId: 'delTS',
                parameters: [
                    {
                        name: 'name',
                        in: 'query',
                        schema: {
                            type: 'string',
                            minLength: 1,
                            maxLength: 40
                        },
                        required: true,
                        description: 'Удаляемая запись'
                    }
                ],
                responses: {
                    '200': {
                        description: 'Сообщение об удалении записи',
                        content: {
                            'application/json': {
                                schema: { type: 'object' },
                                example: {
                                    message: '[OK] 200: Номер удален.'
                                }
                            }
                        }
                    },
                    '400': {
                        description: 'Сообщение о неверных параметрах',
                        content: {
                            'application/json': {
                                schema: { type: 'object' },
                                example: {
                                    message: '[ERROR] 400: Неверные параметры.'
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

module.exports = openapi;