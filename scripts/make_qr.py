from qrcode import QRCode, constants

qr = QRCode(
    version=5,
    box_size=5,
    error_correction=constants.ERROR_CORRECT_H,
    border=5
)
qr.add_data('https://app3774.acapp.acwing.com.cn/media/user/48/BzZNiK4g_gameclub_BHYEvwbs_20221130181718.jpg')
img = qr.make_image()
img.save('../media/qr/test.png')
