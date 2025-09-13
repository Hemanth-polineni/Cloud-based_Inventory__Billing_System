import plotly.graph_objects as go
import plotly.express as px
import json
import pandas as pd
import numpy as np

# Parse the data and add JWT Token
data = [{"component": "React Frontend", "layer": "Frontend", "connections": ["Authentication Service", "Inventory APIs", "Order APIs", "Invoice APIs", "Analytics APIs"]}, 
        {"component": "Authentication Service", "layer": "Backend", "connections": ["Users Table", "JWT Token"]}, 
        {"component": "Inventory APIs", "layer": "Backend", "connections": ["Products Table", "Orders Table"]}, 
        {"component": "Order APIs", "layer": "Backend", "connections": ["Orders Table", "Products Table", "Invoice APIs"]}, 
        {"component": "Invoice APIs", "layer": "Backend", "connections": ["Invoices Table", "PDF Service", "Email Service"]}, 
        {"component": "Analytics APIs", "layer": "Backend", "connections": ["All Tables"]}, 
        {"component": "Products Table", "layer": "Database", "connections": []}, 
        {"component": "Orders Table", "layer": "Database", "connections": []}, 
        {"component": "Users Table", "layer": "Database", "connections": []}, 
        {"component": "Invoices Table", "layer": "Database", "connections": []}, 
        {"component": "PDF Service", "layer": "External", "connections": []}, 
        {"component": "Email Service", "layer": "External", "connections": []}, 
        {"component": "Cloud Storage", "layer": "External", "connections": []},
        {"component": "JWT Token", "layer": "Backend", "connections": []}]

# Define layer colors
layer_colors = {
    "Frontend": "#1FB8CD",    # Strong cyan
    "Backend": "#DB4545",     # Bright red
    "Database": "#2E8B57",    # Sea green
    "External": "#5D878F"     # Cyan
}

# Define clear layer positions with good vertical separation
layer_y_positions = {
    "Frontend": 4,
    "Backend": 2.5,
    "Database": 1,
    "External": 1
}

# Create component positions with much better spacing
components = {}

# Shorten component names to fit in nodes (15 char limit)
def shorten_name(name):
    if name == "Authentication Service":
        return "Auth Svc"
    elif name == "Inventory APIs":
        return "Inventory API"
    elif name == "Order APIs":
        return "Order API"
    elif name == "Invoice APIs":
        return "Invoice API"
    elif name == "Analytics APIs":
        return "Analytics API"
    elif name == "Products Table":
        return "Products Tbl"
    elif name == "Orders Table":
        return "Orders Tbl"
    elif name == "Users Table":
        return "Users Tbl"
    elif name == "Invoices Table":
        return "Invoices Tbl"
    elif name == "PDF Service":
        return "PDF Svc"
    elif name == "Email Service":
        return "Email Svc"
    elif name == "Cloud Storage":
        return "Cloud Store"
    elif name == "React Frontend":
        return "React UI"
    elif name == "JWT Token":
        return "JWT Token"
    return name

# Frontend layer (single component centered)
components["React Frontend"] = {"x": 0, "y": 4, "layer": "Frontend", "short_name": shorten_name("React Frontend")}

# Backend layer (spread horizontally with more spacing)
backend_components = ["Authentication Service", "Inventory APIs", "Order APIs", "Invoice APIs", "Analytics APIs", "JWT Token"]
backend_x_positions = np.linspace(-4, 4, len(backend_components))
for i, comp in enumerate(backend_components):
    components[comp] = {"x": backend_x_positions[i], "y": 2.5, "layer": "Backend", "short_name": shorten_name(comp)}

# Database layer (spread horizontally with more spacing)
database_components = ["Products Table", "Orders Table", "Users Table", "Invoices Table"]
db_x_positions = np.linspace(-3, 1, len(database_components))
for i, comp in enumerate(database_components):
    components[comp] = {"x": db_x_positions[i], "y": 1, "layer": "Database", "short_name": shorten_name(comp)}

# External layer (spread horizontally to the right)
external_components = ["PDF Service", "Email Service", "Cloud Storage"]
ext_x_positions = np.linspace(2, 4, len(external_components))
for i, comp in enumerate(external_components):
    components[comp] = {"x": ext_x_positions[i], "y": 1, "layer": "External", "short_name": shorten_name(comp)}

# Create the figure
fig = go.Figure()

# Add layer background rectangles for visual separation
layer_backgrounds = [
    {"layer": "Frontend", "y": 4, "color": "rgba(31, 184, 205, 0.1)"},
    {"layer": "Backend", "y": 2.5, "color": "rgba(219, 69, 69, 0.1)"},
    {"layer": "Database", "y": 1, "color": "rgba(46, 139, 87, 0.1)"},
]

for bg in layer_backgrounds:
    fig.add_shape(
        type="rect",
        x0=-5, y0=bg["y"]-0.4,
        x1=5, y1=bg["y"]+0.4,
        fillcolor=bg["color"],
        line=dict(width=0),
        layer="below"
    )

# Add connection lines with arrows
def add_arrow_line(x1, y1, x2, y2, color='gray'):
    # Main line
    fig.add_trace(go.Scatter(
        x=[x1, x2],
        y=[y1, y2],
        mode='lines',
        line=dict(color=color, width=1.5, dash='solid'),
        showlegend=False,
        hoverinfo='none'
    ))
    
    # Arrow head
    dx = x2 - x1
    dy = y2 - y1
    length = np.sqrt(dx**2 + dy**2)
    if length > 0:
        # Normalize direction
        dx_norm = dx / length
        dy_norm = dy / length
        
        # Arrow head size
        arrow_size = 0.08
        
        # Arrow head points
        arrow_x = x2 - arrow_size * dx_norm
        arrow_y = y2 - arrow_size * dy_norm
        
        # Perpendicular direction for arrow wings
        perp_x = -dy_norm * arrow_size * 0.5
        perp_y = dx_norm * arrow_size * 0.5
        
        fig.add_trace(go.Scatter(
            x=[arrow_x + perp_x, x2, arrow_x - perp_x],
            y=[arrow_y + perp_y, y2, arrow_y - perp_y],
            mode='lines',
            line=dict(color=color, width=2),
            fill='toself',
            fillcolor=color,
            showlegend=False,
            hoverinfo='none'
        ))

# Add connections with directional arrows
for item in data:
    component = item["component"]
    if component in components:
        for connection in item["connections"]:
            if connection == "All Tables":
                # Connect to all database tables
                for db_item in data:
                    if db_item["layer"] == "Database":
                        add_arrow_line(
                            components[component]["x"], components[component]["y"],
                            components[db_item["component"]]["x"], components[db_item["component"]]["y"]
                        )
            elif connection in components:
                add_arrow_line(
                    components[component]["x"], components[component]["y"],
                    components[connection]["x"], components[connection]["y"]
                )

# Add nodes with text outside to avoid overlap
for layer in ["Frontend", "Backend", "Database", "External"]:
    layer_components = [comp_name for comp_name, comp_data in components.items() if comp_data["layer"] == layer]
    if layer_components:
        # Add marker nodes
        fig.add_trace(go.Scatter(
            x=[components[comp]["x"] for comp in layer_components],
            y=[components[comp]["y"] for comp in layer_components],
            mode='markers',
            marker=dict(
                size=35,
                color=layer_colors[layer],
                line=dict(width=3, color='white')
            ),
            name=layer,
            hoverinfo='text',
            hovertext=[components[comp]["short_name"] for comp in layer_components]
        ))
        
        # Add text labels below nodes
        fig.add_trace(go.Scatter(
            x=[components[comp]["x"] for comp in layer_components],
            y=[components[comp]["y"] - 0.25 for comp in layer_components],
            mode='text',
            text=[components[comp]["short_name"] for comp in layer_components],
            textfont=dict(size=10, color='black', family="Arial"),
            showlegend=False,
            hoverinfo='none'
        ))

# Add layer labels on the left
layer_labels = [
    {"text": "Frontend", "x": -5.5, "y": 4},
    {"text": "Backend", "x": -5.5, "y": 2.5},
    {"text": "Database", "x": -5.5, "y": 1},
    {"text": "External", "x": 5.5, "y": 1}
]

for label in layer_labels:
    fig.add_trace(go.Scatter(
        x=[label["x"]],
        y=[label["y"]],
        mode='text',
        text=[label["text"]],
        textfont=dict(size=14, color='black', family="Arial Black"),
        showlegend=False,
        hoverinfo='none'
    ))

# Update layout
fig.update_layout(
    title="Cloud Inventory System Architecture",
    showlegend=True,
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5),
    xaxis=dict(showgrid=False, zeroline=False, showticklabels=False, range=[-6, 6]),
    yaxis=dict(showgrid=False, zeroline=False, showticklabels=False, range=[0.3, 4.7]),
    plot_bgcolor='white',
    hovermode='closest'
)

# Save the chart
fig.write_image("system_architecture.png", width=1200, height=800)