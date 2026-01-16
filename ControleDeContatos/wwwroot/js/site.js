$(document).ready(function () {
    getDatatable('#table-contatos');
    getDatatable('#table-usuarios');

    $('.btn-total-contatos').click(function () {
        var usuarioId = $(this).attr('usuario-id');
        $.ajax({
            type: 'GET',
            url: '/Usuario/ListarContatosPorUsuarioId/' + usuarioId,
            success: function (result) {
                $("#listaContatosUsuario").html(result);
                var modal = new bootstrap.Modal(document.getElementById('modalContatosUsuario'));
                modal.show();
                getDatatable('#table-contatos-usuario');
            }
        });
    });
});

function getDatatable(id) {
    $(id).DataTable({
        "ordering": true,
        "paging": true,
        "searching": true,
        "language": {
            "emptyTable": "Nenhum registro encontrado na tabela",
            "info": "Mostrar _START_ até _END_ de _TOTAL_ registros",
            "infoEmpty": "Mostrar 0 até 0 de 0 Registros",
            "infoFiltered": "(Filtrar de _MAX_ total registros)",
            "infoPostFix": "",
            "thousands": ".",
            "lengthMenu": "Mostrar _MENU_ registros por página",
            "loadingRecords": "Carregando...",
            "processing": "Processando...",
            "zeroRecords": "Nenhum registro encontrado",
            "search": "Pesquisar",
            "paginate": {
                "next": "Próximo",
                "previous": "Anterior",
                "first": "Primeiro",
                "last": "Último"
            },
            "aria": {
                "sortAscending": ": Ordenar colunas de forma ascendente",
                "sortDescending": ": Ordenar colunas de forma descendente"
            }
        }
    });
}

$('.close-alert').click(function () {
    $(".alert").hide('hide');
});