import jieba
from wordcloud import WordCloud
import matplotlib.pyplot as plt
import numpy as np
from PIL import Image
from django.shortcuts import render
import webbrowser
import time
from os import path
# create stop word list  
def stopwordslist(filepath):  
    stopwords = [line.strip() for line in open(filepath, 'r', encoding='utf-8').readlines()]  
    return stopwords  

# sentence -> word
def seg_sentence(sentence):  
    sentence_seged = jieba.cut(sentence.strip())  
    stopwords = stopwordslist('./stopword.txt')  
    outstr = ''  
    for word in sentence_seged:  
        if word not in stopwords:  
            if word != '\t':  
                outstr += word  
                outstr += " "  
    return outstr 

def generate():
    inputs = open('./comment.txt', 'r', encoding='utf-8')  
    outputs = open('./output.txt', 'w')  
    for line in inputs:  
        line_seg = seg_sentence(line)  # return string
        outputs.write(line_seg + '\n')  
    outputs.close()  
    inputs.close()

    mask_img = np.array(Image.open("./fist_3.png"))
    inputs = open('output.txt', 'r', encoding='utf-8')
    mytext=inputs.read()
    wordcloud=WordCloud(background_color="white",max_words=200,width=2000, height=1600, margin=2,font_path="./simsun.ttf",mask=mask_img,contour_width=3, contour_color='steelblue').generate(mytext)
    wordcloud.to_file("./result.png")
    
    #html_cotent = f"<html><body><div> {{ wordcloud }} </div> </body></html>"
    
    #with open("test.html", "w") as html_file:
        #html_file.write(html_cotent)
        #print("successful!!!")
    
    #time.sleep(2)
    #webbrowser.open_new_tab("test.html")
    #return render(request, 'test.html', {'wordcloud':wordcloud})

if __name__ == "__main__":
    generate()