let idTarefa = 0;

function criarTarefa() {
  const inputTarefa = document.getElementById('inputTarefa');
  const inputPrazo = document.getElementById('inputPrazo');
  const descricao = inputTarefa.value.trim();
  const prazo = inputPrazo.value.trim();
  const regexData = /^\d{4}-\d{2}-\d{2}$/;

  if (!descricao || !prazo) {
    mostrarErro('Preencha todos os campos.');
    return;
  }

  if (!regexData.test(prazo)) {
    mostrarErro('Formato de prazo inválido. Use AAAA-MM-DD.');
    return;
  }

  const div = document.createElement('div');
  div.className = 'tarefa';
  div.draggable = true;
  div.innerHTML = `<strong>${descricao}</strong><br><small>Prazo: ${prazo}</small>`;
  div.id = 'tarefa-' + idTarefa++;
  div.dataset.etapa = 'fazer';
  div.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', div.id));

  document.getElementById('fazer').appendChild(div);
  inputTarefa.value = '';
  inputPrazo.value = '';
  mostrarSucesso('Tarefa criada com sucesso.');
}

function permitirDrop(e) {
  e.preventDefault();
}

function soltar(e, destino) {
  e.preventDefault();
  const id = e.dataTransfer.getData('text/plain');
  const tarefa = document.getElementById(id);
  const origem = tarefa.dataset.etapa;
  const tipoUsuario = document.getElementById('tipoUsuario').value;

  if (destino === 'aprovar' && tipoUsuario !== 'gerente') {
    mostrarErro('Apenas gerentes podem mover tarefas para APROVAR.');
    return;
  }

  if (destino === 'verificar' && origem !== 'fazer') {
    mostrarErro('A tarefa precisa passar por FAZER antes de VERIFICAR.');
    return;
  }

  if (destino === 'aprovar' && origem !== 'verificar') {
    mostrarErro('A tarefa precisa passar por VERIFICAR antes de APROVAR.');
    return;
  }

  tarefa.dataset.etapa = destino;
  document.getElementById(destino).appendChild(tarefa);
  mostrarSucesso('Tarefa movida com sucesso.');
}

function mostrarErro(msg) {
  const el = document.getElementById('mensagem');
  el.textContent = msg;
  el.style.color = 'red';
}

function mostrarSucesso(msg) {
  const el = document.getElementById('mensagem');
  el.textContent = msg;
  el.style.color = 'green';
}