const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");

// Listar todos os usuários (apenas admin)
exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.status(200).json(usuarios);
  } catch (err) {
    console.error("Erro ao listar usuários:", err);
    res
      .status(500)
      .json({ message: "Erro ao listar usuários", error: err.message });
  }
};

// Função para buscar o perfil do usuário autenticado
exports.getPerfil = async (req, res) => {
  try {
    const userId = req.user._id; // ID do usuário autenticado, obtido do token JWT
    const usuario = await Usuario.findById(userId).select("-password");

    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.status(200).json(usuario);
  } catch (err) {
    console.error("Erro ao buscar perfil do usuário:", err);
    res
      .status(500)
      .json({ message: "Erro ao buscar perfil", error: err.message });
  }
};

// Função para atualizar o perfil do próprio usuário
exports.atualizarPerfil = async (req, res) => {
  try {
    const userId = req.user._id; // ID do usuário do token JWT, NÃO DA URL
    const { username, numeroTelefone, senhaAtual, novaSenha } = req.body;

    const usuario = await Usuario.findById(userId);

    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    // Verifica se o usuário deseja alterar a senha
    if (senhaAtual && novaSenha) {
      const senhaValida = await bcrypt.compare(senhaAtual, usuario.password);
      if (!senhaValida) {
        return res.status(400).json({ message: "Senha atual incorreta" });
      }
      usuario.password = await bcrypt.hash(novaSenha, 10);
    }

    // Atualiza o nome de usuário e telefone
    if (username) usuario.username = username;
    if (numeroTelefone) usuario.numeroTelefone = numeroTelefone;

    await usuario.save();
    res.status(200).json({ message: "Perfil atualizado com sucesso", usuario });
  } catch (err) {
    console.error("Erro ao atualizar perfil:", err);
    res
      .status(500)
      .json({ message: "Erro ao atualizar perfil", error: err.message });
  }
};

// Atualizar um usuário (apenas admin)
exports.atualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { username, role, numeroTelefone } = req.body;

  try {
    const usuario = await Usuario.findById(id);

    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    // Atualiza o nome de usuário, role e telefone, se fornecidos
    if (username) usuario.username = username;
    if (role) usuario.role = role;
    if (numeroTelefone) usuario.numeroTelefone = numeroTelefone;

    await usuario.save();
    res
      .status(200)
      .json({ message: "Usuário atualizado com sucesso", usuario });
  } catch (err) {
    console.error("Erro ao atualizar usuário:", err);
    res
      .status(500)
      .json({ message: "Erro ao atualizar usuário", error: err.message });
  }
};

// Excluir um usuário (apenas admin)
exports.excluirUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await Usuario.findByIdAndDelete(id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.status(200).json({ message: "Usuário excluído com sucesso" });
  } catch (err) {
    console.error("Erro ao excluir usuário:", err);
    res
      .status(500)
      .json({ message: "Erro ao excluir usuário", error: err.message });
  }
};

// Middleware para verificar o papel (role) do usuário
exports.verificarRole = (rolesPermitidos) => {
  return (req, res, next) => {
    const { role } = req.user; // Papel do usuário está no objeto req.user, após o middleware 'proteger'
    if (rolesPermitidos.includes(role)) {
      return next(); // Se o papel do usuário estiver permitido, continua para o próximo middleware
    } else {
      return res.status(403).json({ message: "Acesso negado." }); // Se não, retorna acesso negado
    }
  };
};
