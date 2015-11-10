$(function () {
    // this portion is responsible for the actions in the login box (bootstrap alerts)
    // it must be ready upon document load
    $('#chkSecureChat').change(function () {
        if (this.checked)
            $('#divSecureWarning').fadeIn('slow');
        else {
            $('#divSecureWarning').slideUp('slow');
            // TODO - close terms of service as well.
        }
    });
    $("#warning-toc").click(function () {
        $('.alert-info').show()
    });
    $("[data-hide]").on("click", function () {
        $(this).closest("." + $(this).attr("data-hide")).hide();
    });

    setScreen(false);

    // Calculating margin-left to align it to center;
    var width = $('.navbar-center').width();
    $('.navbar-center').css('margin-left', '-' + (width / 2) + 'px');

    $('.more-info').click(function () {
        $('.login').css('width', '50%');
        $('.more-info-box').css('width', '50%');
        $('#anchor-more-info').hide();
        $('#anchor-hide-info').show();
    });
    $('.hide-info').click(function () {
        $('.login').css('width', '100%');
        $('.more-info-box').css('width', '0px');
        $('#anchor-more-info').show();
        $('#anchor-hide-info').hide();
    });

    // For tooltips
    $('[data-toggle="tooltip"]').tooltip();
});

function setScreen(isLogin) {
    if (!isLogin) {
        $("#divChat").hide();
        $("#divLogin").show();
        $("#divMoreInfo").show();
        $("#settings-glyph").addClass("hidden");
        $("#btnLogout").hide();
    }
    else {
        $("#divChat").show();
        $("#divLogin").hide();
        $("#divMoreInfo").hide();
        $("#settings-glyph").removeClass("hidden");
        $("#btnLogout").show();
    }
}
