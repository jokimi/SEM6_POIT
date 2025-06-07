$(function () {
    $('[data-toggle="tooltip"]').tooltip();
});

function previewImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            $('.image-preview').attr('src', e.target.result);
            $('.image-preview-container').show();
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function confirmDelete(celebrityId, celebrityName) {
    if (confirm(`Are you sure you want to delete ${celebrityName}?`)) {
        $.post(`/Celebrities/Delete/${celebrityId}`, function () {
            window.location.href = '/Celebrities';
        });
    }
}

$(document).ready(function () {
    $('form').validate({
        rules: {
            FullName: "required",
            Nationality: "required",
            Photo: {
                required: true,
                extension: "jpg|jpeg|png"
            }
        },
        messages: {
            FullName: "Please enter the celebrity's name",
            Nationality: "Please select a nationality",
            Photo: {
                required: "Please upload a photo",
                extension: "Only JPG, JPEG or PNG files are allowed"
            }
        }
    });
});