CREATE TABLE categorias (
                            id INT AUTO_INCREMENT PRIMARY KEY,
                            nome VARCHAR(50) NOT NULL
);


CREATE TABLE fornecedores (
                              id INT AUTO_INCREMENT PRIMARY KEY,
                              nome VARCHAR(100) NOT NULL,
                              telefone VARCHAR(20),
                              email VARCHAR(100)
);


CREATE TABLE produto (
                         id INT AUTO_INCREMENT PRIMARY KEY,
                         nome VARCHAR(100) NOT NULL,
                         preco DECIMAL(10, 2) NOT NULL,
                         quantidade INT NOT NULL DEFAULT 0,
                         validade DATE,
                         categoria_id INT,
                         fornecedor_id INT,
                         FOREIGN KEY (categoria_id) REFERENCES categorias(id),
                         FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id)
);


CREATE TABLE movimentacoes_estoque (
                                       id INT AUTO_INCREMENT PRIMARY KEY,
                                       produto_id INT NOT NULL,
                                       tipo ENUM('entrada', 'saida') NOT NULL,
                                       quantidade INT NOT NULL,
                                       data DATETIME DEFAULT CURRENT_TIMESTAMP,
                                       descricao TEXT,
                                       FOREIGN KEY (produto_id) REFERENCES produto(id)
);
