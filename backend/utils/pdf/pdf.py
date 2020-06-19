from uuid import uuid4
from pylab import axis, savefig
from fpdf import FPDF
import matplotlib.pyplot as plt
import os

info = {'Name': 'Олег', 'Surname': 'Киба',
        'Section': 'важка атлетика', 'Group': 'ІВ-72',
        'year1': 2019, 'year2': 2020,
        'Current year': 2020, 'Current month': 10}

data = [[i for i in range(1, 32)],
        [65, 64, 61, 60, 65, 64, 67, 55, 45,
         48, 49, 44, 52, 63, 69, 69, 49, 59, 61,
         65, 65, 65, 65, 65, 65, 65, 65, 65, 65,
         65, 65]]


data2 = [[i for i in range(1, 32)],
         [5, 5, 3, 5, 2, 4, 3, 2, 4,
          5, 3, 4, 4, 3, 2, 3, 5, 4, 3,
          4, 5, 3, 4, 2, 3, 4, 4, 2, 3,
          1, 2]]

filename = "test.pdf"


def generate_pdf(info, data, data2, filename):
    # plot1
    x = data[0]
    y = data[1]

    fig, ax = plt.subplots()
    ax.bar(data[0], data[1], align='center')
    ax.set_xlim(left=1)
    ax.set_xlabel('Дні')
    ax.set_ylabel('П1')

    ax.set_facecolor('white')
    fig.set_facecolor('white')
    fig.set_figwidth(7)  # ширина Figure
    fig.set_figheight(3)  # высота Figure

    axis([0, 31, 0, max(data[1])])

    image1 = '{}_{}_1_{}.png'.format(filename, info['Current month'], uuid4())
    savefig(image1)

    '''
    ["А", '65', '67', '55', '65', '63', '57', '59', '58', '60',
     '61', '63', '48', '49', '51', '53', '56', '48', '53', '61',
     '61', '55', '59', '69', '53', '48', '68', '67', '64', '62',
     '65', '65'],
    ["B", '65', '64', '61', '60', '65', '64', '67', '55', '45',
     '48', '49', '44', '52', '63', '69', '69', '49', '59', '61',
     '65', '65', '65', '65', '65', '65', '65', '65', '65', '65',
     '65', '65']]

    ["C", 5, 3, 4, 2, 1, 3, 5, 4, 2,
     3, 4, 5, 5, 3, 2, 3, 4, 4, 4,
     2, 3, 3, 3, 4, 4, 2, 5, 4, 4,
     4, 5],
    '''

    # plot2

    x = data2[0]
    y = data2[1]

    fig, ax = plt.subplots()
    ax.bar(data2[0], data2[1], align='center')
    ax.set_xlim(left=1)
    ax.set_xlabel('Дні')
    ax.set_ylabel('С')

    ax.bar(x, y)

    ax.set_facecolor('white')
    fig.set_facecolor('white')
    fig.set_figwidth(7)  # ширина Figure
    fig.set_figheight(3)  # высота Figure

    axis([0, 31, 0, 5])

    image2 = '{}_{}_2_{}.png'.format(filename, info['Current month'], uuid4())
    savefig(image2)

    pdf = FPDF()

    # First page(title page)
    pdf.add_page()
    pdf.add_font('DejaVuSerif', '', 'DejaVuSerif.ttf', uni=True)
    pdf.add_font('DejaVuSerif-Bold', '', 'DejaVuSerif-Bold.ttf', uni=True)
    pdf.add_font('DejaVuSerif-Italic', '', 'DejaVuSerif-Italic.ttf', uni=True)
    pdf.set_font('DejaVuSerif-Bold', '', 14)
    pdf.cell(200, 10, txt="НАЦІОНАЛЬНИЙ ТЕХНІЧНИЙ УНІВЕРСИТЕТ УКРАЇНИ", ln=1, align="C")
    pdf.cell(190, 10, txt="«КИЇВСЬКИЙ ПОЛІТЕХНІЧНИЙ ІНСТИТУТ", ln=1, align="C")
    pdf.cell(190, 10, txt="ІМ. ІГОРЯ СІКОРСЬКОГО»", ln=1, align="C")
    pdf.cell(190, 60, txt=" ", ln=1, align="C")
    pdf.cell(200, 10, txt="Щоденник самоконтролю студента", ln=1, align="C")
    pdf.cell(200, 10, txt="для практичних занять з дисципліни «Фізичне виховання»", ln=1, align="C")
    pdf.cell(190, 60, txt='{} {}'.format(info['Surname'], info['Name']), ln=1, align="C")
    pdf.cell(185, 10, txt="Вид спорту: {}".format(info['Section']), ln=1, align="R")
    pdf.cell(185, 20, txt="Навчальна група: {}".format(info['Group']), ln=1, align="R")
    pdf.cell(200, 66.7, txt="{}-{} н.р.".format(info['year1'], info['year2']), ln=1, align="C")

    # Second page(tables)
    pdf.add_page(orientation='A')
    pdf.set_font('DejaVuSerif', '', 14)
    pdf.cell(275, 10, txt="Показники контролю функціонального стану студента ({} {}, {} гр.) за {} місяць".format(
        info['Surname'], info['Name'], info['Group'], info['Current month']), ln=1, align="C")
    pdf.set_font('DejaVuSerif', '', 12)
    pdf.cell(275, 5, txt="(заповнюється з вересня по червень, подається викладачу щомісяця в паперовому форматі)", ln=1,
             align="C")
    pdf.set_font('DejaVuSerif-Italic', '', 14)
    pdf.cell(20, 25, txt="Примітка. П1 - пульс, або частота серцевих скорочень (ЧСС), за 1 хвилину зранку.", ln=1,
             align="L")

    epw = pdf.w - 2 * pdf.l_margin
    pdf.cell(epw, 0.0, '', align='C')
    pdf.set_font('DejaVuSerif', '', 12)
    pdf.ln(0)
    col_width = 8.7
    th = 17

    for row in data:
        for datum in row:
            pdf.cell(col_width, th, str(datum), border=1)

        pdf.ln(th)

    pdf.cell(190, 5, txt=" ", ln=1, align="C")
    pdf.cell(275, 20,
             txt="(середній пульс спокою зранку за місяць зараховується як 100%; значення пульсу на початку та в кінці заняття",
             ln=1, align="C")
    pdf.cell(275, -5, txt="студенти переводять у відсотки відносно до середнього значення", ln=1, align="C")
    pdf.cell(275, 20, txt="пульсу спокою зранку за місяць і заносять у відповідні графи)", ln=1, align="C")
    pdf.set_font('DejaVuSerif-Italic', '', 14)
    pdf.cell(275, 15, txt="Примітка. С - самопочуття в кінці заняття", ln=1, align="L")
    pdf.set_font('DejaVuSerif', '', 12)
    pdf.cell(275, 10, txt="*Самопочуття оцінюється в балах від 1 до 5", ln=1, align="C")
    pdf.cell(100, 1, txt=" ", ln=1, align="C")
    epw1 = pdf.w - 2 * pdf.l_margin
    pdf.cell(epw1, 0.0, '', align='C')
    pdf.set_font('DejaVuSerif', '', 12)
    pdf.ln(0)
    col_width = 8.7
    th = 17

    for row in data2:
        for datum in row:
            pdf.cell(col_width, th, str(datum), border=1)

        pdf.ln(th)

    # Third page(plots)
    pdf.add_page()
    pdf.set_font('DejaVuSerif', '', 14)
    pdf.image(image1, x=-17, y=10, w=0, h=0, type='', link='')
    pdf.cell(0, 220, 'Графік 1. Показники ЧСС студента {} {}, гр. {} за {} {} р.'.format(info['Surname'], info['Name'],
                                                                                         info['Group'],
                                                                                         info['Current month'],
                                                                                         info['Current year']), 0, 1,
             'C', 0)
    pdf.image(image2, x=-17, y=145, w=0, h=0, type='', link='')
    pdf.cell(0, 46.5, 'Графік 2. Значення рівня функціонального стану студента', 0, 1, 'C', 0)
    pdf.cell(0, -33, '{} {}, гр. {}'.format(info['Surname'], info['Name'], info['Group']), 0, 1, 'C', 0)
    pdf.output(filename, 'F')

    os.remove(image1)
    os.remove(image2)


#generate_pdf(info, data, data2, filename)

"""
data3 = [[i for i in range(1, 32)],
        [65, 64, 61, 60, 65, 64, 67, 55, 45,
         48, 49, 44, 52, 63, 69, 69, 49, 59, 61,
         65, 65, 65, 65, 65, 65, 65, 65, 65, 65,
         65, 65]]

fig, ax = plt.subplots()
ax.bar(data3[0], data3[1], align='center')
ax.set_xlim(left=1)
ax.set_xlabel('Дні')
ax.set_ylabel('П1')

plt.show()
"""
